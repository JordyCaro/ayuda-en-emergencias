import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import type { NeedCategory, NeedCreateResponse, NeedDto, NeedIntent } from '@aee/shared-types';
import { NeedEntity } from './need.entity';
import { CreateNeedDto } from './dto/create-need.dto';
import { cityCenter } from '../geo/city-centers';
import { findCityByCode } from '../geo/cities.seed';
import { resolvePlaceFromPoint } from '../geo/resolve-location';
import { hashManageToken, issueManageToken } from '../common/manage-token';
import { NEED_TTL_MS } from '../common/ttl';

export interface ListNeedsQuery {
  country?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  category?: NeedCategory;
  intent?: NeedIntent;
  cityCode?: string;
}

@Injectable()
export class NeedsService {
  constructor(
    @InjectRepository(NeedEntity)
    private readonly repo: Repository<NeedEntity>,
  ) {}

  async create(dto: CreateNeedDto): Promise<NeedCreateResponse> {
    let lng: number;
    let lat: number;
    let cityCode = dto.cityCode?.trim() || null;
    let municipality: string | null = null;

    if (dto.geometry?.coordinates) {
      const coords = dto.geometry.coordinates;
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
      [lng, lat] = coords;
    } else if (cityCode) {
      const center = cityCenter(cityCode);
      if (!center) throw new BadRequestException('cityCode desconocido');
      lng = center.lng;
      lat = center.lat;
      municipality = findCityByCode(cityCode)?.name ?? center.name;
    } else {
      throw new BadRequestException('Indica cityCode o geometry');
    }

    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      throw new BadRequestException('coordinates out of range');
    }

    if (cityCode) {
      const city = findCityByCode(cityCode);
      if (!city) throw new BadRequestException('cityCode desconocido');
      municipality = city.name;
    } else if (dto.geometry?.coordinates) {
      const resolved = await resolvePlaceFromPoint(lat, lng);
      cityCode = resolved.cityCode;
      municipality = resolved.municipality;
    }

    const whatsapp = normalizeWhatsapp(dto.contactWhatsapp);
    const description = dto.description.trim();
    if (description.length < 8) {
      throw new BadRequestException('Describe un poco más (mín. 8 caracteres)');
    }

    const token = issueManageToken();
    const row = await this.repo.save(
      this.repo.create({
        category: dto.category,
        intent: dto.intent,
        description,
        geometry: { type: 'Point', coordinates: [lng, lat] },
        lng,
        lat,
        source: 'USER',
        verification: 'UNVERIFIED',
        status: 'OPEN',
        country: 'CO',
        cityCode,
        municipality,
        contactWhatsapp: whatsapp,
        manageTokenHash: token.hash,
        expiresAt: new Date(Date.now() + NEED_TTL_MS),
      }),
    );
    return { ...this.toDto(row), manageToken: token.plain };
  }

  async list(query: ListNeedsQuery): Promise<NeedDto[]> {
    const qb = this.repo
      .createQueryBuilder('n')
      .where('n.status = :status', { status: 'OPEN' })
      .andWhere('(n.expires_at IS NULL OR n.expires_at > NOW())')
      .orderBy('n.created_at', 'DESC')
      .take(200);

    if (query.category) {
      qb.andWhere('n.category = :category', { category: query.category });
    }
    if (query.intent) {
      qb.andWhere('n.intent = :intent', { intent: query.intent });
    }
    if (query.cityCode) {
      qb.andWhere('n.city_code = :cityCode', { cityCode: query.cityCode });
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
              sin(radians(n.lat)) * sin(radians(:lat))
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

  async previewForManage(id: string, manageToken: string) {
    const n = await this.repo.findOne({ where: { id } });
    if (!n || !n.manageTokenHash || n.manageTokenHash !== hashManageToken(manageToken)) {
      throw new NotFoundException('Aviso no encontrado o enlace inválido');
    }
    return {
      kind: 'need' as const,
      id: n.id,
      title: n.description.slice(0, 160),
      status: n.status,
      municipality: n.municipality,
    };
  }

  async closeWithToken(id: string, manageToken: string): Promise<NeedDto> {
    const n = await this.repo.findOne({ where: { id } });
    if (!n || !n.manageTokenHash || n.manageTokenHash !== hashManageToken(manageToken)) {
      throw new NotFoundException('Aviso no encontrado o enlace inválido');
    }
    n.status = 'CLOSED';
    await this.repo.save(n);
    return this.toDto(n);
  }

  /** Borra avisos ya caducados (limpieza de DB + WhatsApp). */
  async purgeExpired(): Promise<number> {
    const result = await this.repo.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected ?? 0;
  }

  private toDto(n: NeedEntity): NeedDto {
    return {
      id: n.id,
      category: n.category,
      intent: n.intent ?? 'NEED',
      description: n.description,
      geometry: n.geometry,
      verification: n.verification,
      status: n.status,
      createdAt: n.createdAt.toISOString(),
      source: 'USER',
      cityCode: n.cityCode,
      municipality: n.municipality,
      contactWhatsapp: n.contactWhatsapp,
    };
  }
}

function normalizeWhatsapp(raw?: string): string | null {
  if (!raw?.trim()) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length === 12) return digits;
  if (digits.length === 10 && digits.startsWith('3')) return `57${digits}`;
  if (digits.length === 11 && digits.startsWith('03')) return `57${digits.slice(1)}`;
  throw new BadRequestException(
    'WhatsApp inválido: usa celular colombiano (10 dígitos que empiecen por 3)',
  );
}
