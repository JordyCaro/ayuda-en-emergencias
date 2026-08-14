import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { NeedCategory, NeedDto } from '@aee/shared-types';
import { NeedEntity } from './need.entity';
import { CreateNeedDto } from './dto/create-need.dto';

export interface ListNeedsQuery {
  country?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  category?: NeedCategory;
}

@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(NeedEntity)
    private readonly repo: Repository<NeedEntity>,
  ) {}

  async create(dto: CreateNeedDto): Promise<NeedDto> {
    const coords = dto.geometry?.coordinates;
    if (
      !Array.isArray(coords) ||
      coords.length !== 2 ||
      typeof coords[0] !== 'number' ||
      typeof coords[1] !== 'number' ||
      Number.isNaN(coords[0]) ||
      Number.isNaN(coords[1])
    ) {
      throw new BadRequestException('geometry.coordinates must be [lng, lat]');
    }
    const [lng, lat] = coords;
    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new BadRequestException('coordinates out of range');
    }

    const row = await this.repo.save(
      this.repo.create({
        category: dto.category,
        description: dto.description.trim(),
        geometry: { type: 'Point', coordinates: [lng, lat] },
        lng,
        lat,
        source: 'USER',
        verification: 'UNVERIFIED',
        status: 'OPEN',
        country: 'CO',
      }),
    );
    return this.toDto(row);
  }

  async list(query: ListNeedsQuery): Promise<NeedDto[]> {
    const qb = this.repo
      .createQueryBuilder('n')
      .where('n.status = :status', { status: 'OPEN' })
      .orderBy('n.created_at', 'DESC')
      .take(500);

    if (query.category) {
      qb.andWhere('n.category = :category', { category: query.category });
    }
    if (query.country) {
      qb.andWhere('n.country = :country', { country: query.country });
    }
    if (
      query.lat != null &&
      query.lng != null &&
      query.radius != null &&
      query.radius > 0
    ) {
      qb.andWhere(
        `(
          6371000 * acos(
            least(1, greatest(-1,
              cos(radians(:lat)) * cos(radians(n.lat)) *
              cos(radians(n.lng) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(n.lat))
            ))
          )
        ) <= :radius`,
        { lat: query.lat, lng: query.lng, radius: query.radius },
      );
    }

    const rows = await qb.getMany();
    return rows.map((n) => this.toDto(n));
  }

  async getById(id: string): Promise<NeedDto> {
    const n = await this.repo.findOne({ where: { id } });
    if (!n) throw new NotFoundException(`Need ${id} not found`);
    return this.toDto(n);
  }

  private toDto(n: NeedEntity): NeedDto {
    return {
      id: n.id,
      category: n.category,
      description: n.description,
      geometry: n.geometry,
      verification: n.verification,
      status: n.status,
      createdAt: n.createdAt.toISOString(),
      source: 'USER',
    };
  }
}
