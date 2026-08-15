import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import type { CreatePlaceRequest, PlaceDto, PlaceType } from '@aee/shared-types';
import { PlaceEntity } from './place.entity';
import {
  assertValidBBox,
  clampLimit,
  clampOffset,
  isValidLatLng,
} from '../common/geo';
import { findCityByCode } from '../geo/cities.seed';

export interface ListPlacesQuery {
  lat?: number;
  lng?: number;
  radius?: number;
  type?: PlaceType;
  west?: number;
  south?: number;
  east?: number;
  north?: number;
  limit?: number;
  offset?: number;
  cityCode?: string;
  origin?: 'community' | 'official' | 'all';
}

export interface ListPlacesResult {
  data: PlaceDto[];
  meta: { limit: number; offset: number; count: number };
}

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(PlaceEntity)
    private readonly repo: Repository<PlaceEntity>,
  ) {}

  async list(query: ListPlacesQuery): Promise<ListPlacesResult> {
    const limit = clampLimit(query.limit, 200, 800);
    const offset = clampOffset(query.offset);

    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.status = :status', { status: 'ACTIVE' })
      .andWhere('(p.expires_at IS NULL OR p.expires_at > NOW())')
      .orderBy('p.updated_at', 'DESC')
      .take(limit)
      .skip(offset);

    if (query.type) {
      qb.andWhere('p.type = :type', { type: query.type });
    }
    if (query.cityCode) {
      qb.andWhere('p.city_code = :cityCode', { cityCode: query.cityCode });
    }
    if (query.origin === 'community') {
      qb.andWhere('p.source_id = :sid', { sid: 'community' });
    } else if (query.origin === 'official') {
      qb.andWhere('p.source_id != :sid', { sid: 'community' });
    }

    const hasBbox =
      query.west != null &&
      query.south != null &&
      query.east != null &&
      query.north != null;

    if (hasBbox) {
      try {
        assertValidBBox(
          {
            west: query.west!,
            south: query.south!,
            east: query.east!,
            north: query.north!,
          },
          { maxSpanDeg: 12 },
        );
      } catch (e) {
        throw new BadRequestException(e instanceof Error ? e.message : String(e));
      }
      qb.andWhere('p.lng BETWEEN :west AND :east', {
        west: query.west,
        east: query.east,
      });
      qb.andWhere('p.lat BETWEEN :south AND :north', {
        south: query.south,
        north: query.north,
      });
    } else if (
      query.lat != null &&
      query.lng != null &&
      query.radius != null &&
      query.radius > 0
    ) {
      if (!isValidLatLng(query.lat, query.lng)) {
        throw new BadRequestException('lat/lng inválidos');
      }
      qb.andWhere(
        `(
          6371000 * acos(
            least(1, greatest(-1,
              cos(radians(:lat)) * cos(radians(p.lat)) *
              cos(radians(p.lng) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(p.lat))
            ))
          )
        ) <= :radius`,
        { lat: query.lat, lng: query.lng, radius: query.radius },
      );
    }

    const rows = await qb.getMany();
    return {
      data: rows.map((p) => this.toDto(p)),
      meta: { limit, offset, count: rows.length },
    };
  }

  async getById(id: string): Promise<PlaceDto> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`Place ${id} not found`);
    return this.toDto(p);
  }

  async createCommunity(dto: CreatePlaceRequest): Promise<PlaceDto> {
    const coords = dto.geometry?.coordinates;
    if (!Array.isArray(coords) || coords.length !== 2) {
      throw new BadRequestException('geometry.coordinates must be [lng, lat]');
    }
    const [lng, lat] = coords;
    if (!isValidLatLng(lat, lng)) {
      throw new BadRequestException('coordenadas lat/lng inválidas');
    }
    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('title required');

    const cityCode = dto.cityCode?.trim();
    if (!cityCode) throw new BadRequestException('cityCode required');
    const city = findCityByCode(cityCode);
    if (!city) {
      throw new BadRequestException(
        'cityCode desconocido (usa GET /geo/cities con un código DIVIPOLA del catálogo)',
      );
    }

    const row = await this.repo.save(
      this.repo.create({
        type: dto.type,
        title: title.slice(0, 512),
        description: dto.description?.trim() || null,
        geometry: { type: 'Point', coordinates: [lng, lat] },
        lng,
        lat,
        sourceId: 'community',
        sourceRecordId: `user:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`,
        verification: 'UNVERIFIED',
        status: 'ACTIVE',
        country: 'CO',
        cityCode: city.code,
        municipality: city.name,
        department: city.department,
        externalUrl: dto.externalUrl?.trim() || null,
        retrievedAt: new Date(),
        expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
        properties: { origin: 'USER_FORM', divipola: city.code },
      }),
    );
    return this.toDto(row);
  }

  async upsertOfficial(input: {
    type: PlaceEntity['type'];
    title: string;
    description?: string | null;
    lat: number;
    lng: number;
    sourceId: string;
    sourceRecordId: string;
    verification: PlaceEntity['verification'];
    address?: string | null;
    municipality?: string | null;
    department?: string | null;
    cityCode?: string | null;
    externalUrl?: string | null;
    retrievedAt: Date;
    properties?: Record<string, unknown>;
  }): Promise<PlaceEntity> {
    let row = await this.repo.findOne({
      where: {
        sourceId: input.sourceId,
        sourceRecordId: input.sourceRecordId,
      },
    });
    const payload = {
      ...input,
      geometry: {
        type: 'Point' as const,
        coordinates: [input.lng, input.lat] as [number, number],
      },
      status: 'ACTIVE' as const,
      country: 'CO',
      cityCode: input.cityCode ?? null,
      properties: input.properties ?? {},
    };
    if (!row) {
      row = this.repo.create(payload);
    } else {
      Object.assign(row, payload);
    }
    return this.repo.save(row);
  }

  async upsertOfficialBatch(
    inputs: Array<Parameters<PlacesService['upsertOfficial']>[0]>,
  ): Promise<number> {
    const chunkSize = 50;
    let count = 0;
    for (let i = 0; i < inputs.length; i += chunkSize) {
      const chunk = inputs.slice(i, i + chunkSize);
      await Promise.all(chunk.map((item) => this.upsertOfficial(item)));
      count += chunk.length;
    }
    return count;
  }

  async expireStale(): Promise<number> {
    const result = await this.repo.update(
      {
        status: 'ACTIVE',
        expiresAt: LessThan(new Date()),
      },
      { status: 'EXPIRED' },
    );
    return result.affected ?? 0;
  }

  private toDto(p: PlaceEntity): PlaceDto {
    return {
      id: p.id,
      type: p.type,
      title: p.title,
      description: p.description,
      geometry: p.geometry,
      sourceId: p.sourceId,
      sourceName:
        p.sourceId === 'sispro'
          ? 'SISPRO / REPS (MinSalud)'
          : p.sourceId === 'community'
            ? 'Comunidad'
            : p.sourceId,
      verification: p.verification,
      status: p.status,
      address: p.address,
      municipality: p.municipality,
      department: p.department,
      cityCode: p.cityCode,
      externalUrl: p.externalUrl,
      retrievedAt: p.retrievedAt?.toISOString() ?? null,
      updatedAt: p.updatedAt?.toISOString() ?? null,
    };
  }
}
