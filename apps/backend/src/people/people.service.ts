import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import type {
  CreatePersonReportRequest,
  PersonReportCreateResponse,
  PersonReportDto,
  PersonReportKind,
} from '@aee/shared-types';
import { PersonReportEntity } from './person-report.entity';
import { cityCenter } from '../geo/city-centers';
import { findCityByCode } from '../geo/cities.seed';
import { hashManageToken, issueManageToken } from '../common/manage-token';
import { PERSON_TTL_MS } from '../common/ttl';
import { parseJpegPhoto } from '../common/jpeg-photo';

@Injectable()
export class PeopleService {
  constructor(
    @InjectRepository(PersonReportEntity)
    private readonly repo: Repository<PersonReportEntity>,
  ) {}

  async create(dto: CreatePersonReportRequest): Promise<PersonReportCreateResponse> {
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
        typeof coords[1] !== 'number'
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

    if (cityCode) {
      const city = findCityByCode(cityCode);
      if (!city) throw new BadRequestException('cityCode desconocido');
      municipality = city.name;
    }

    const description = dto.description.trim();
    if (description.length < 8) {
      throw new BadRequestException('Describe un poco más (mín. 8 caracteres)');
    }
    const photo = parseJpegPhoto(dto.photoBase64);

    const token = issueManageToken();
    const row = await this.repo.save(
      this.repo.create({
        kind: dto.kind,
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
        contactWhatsapp: normalizeWhatsapp(dto.contactWhatsapp),
        manageTokenHash: token.hash,
        expiresAt: new Date(Date.now() + PERSON_TTL_MS),
        photoJpeg: photo,
        hasPhoto: Boolean(photo),
      }),
    );
    return { ...this.toDto(row), manageToken: token.plain };
  }

  async list(opts?: { kind?: PersonReportKind; cityCode?: string }): Promise<PersonReportDto[]> {
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.status = :status', { status: 'OPEN' })
      .andWhere('(p.expires_at IS NULL OR p.expires_at > NOW())')
      .orderBy('p.created_at', 'DESC')
      .take(200);

    if (opts?.kind) qb.andWhere('p.kind = :kind', { kind: opts.kind });
    if (opts?.cityCode) qb.andWhere('p.city_code = :cityCode', { cityCode: opts.cityCode });

    const rows = await qb.getMany();
    return rows.map((r) => this.toDto(r));
  }

  async getById(id: string): Promise<PersonReportDto> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException(`Person report ${id} not found`);
    return this.toDto(row);
  }

  async previewForManage(id: string, manageToken: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row || !row.manageTokenHash || row.manageTokenHash !== hashManageToken(manageToken)) {
      throw new NotFoundException('Aviso no encontrado o enlace inválido');
    }
    return {
      kind: 'person' as const,
      id: row.id,
      title: row.description.slice(0, 160),
      status: row.status,
      municipality: row.municipality,
    };
  }

  async closeWithToken(id: string, manageToken: string): Promise<PersonReportDto> {
    const row = await this.repo.findOne({ where: { id } });
    if (!row || !row.manageTokenHash || row.manageTokenHash !== hashManageToken(manageToken)) {
      throw new NotFoundException('Aviso no encontrado o enlace inválido');
    }
    row.status = 'CLOSED';
    await this.repo.save(row);
    return this.toDto(row);
  }

  async purgeExpired(): Promise<number> {
    const result = await this.repo.delete({
      expiresAt: LessThan(new Date()),
    });
    return result.affected ?? 0;
  }

  private toDto(row: PersonReportEntity): PersonReportDto {
    return {
      id: row.id,
      kind: row.kind,
      description: row.description,
      geometry: row.geometry,
      verification: row.verification,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      source: 'USER',
      cityCode: row.cityCode,
      municipality: row.municipality,
      contactWhatsapp: row.contactWhatsapp,
      hasPhoto: Boolean(row.hasPhoto),
    };
  }

  async getPhotoJpeg(id: string): Promise<Buffer> {
    const row = await this.repo
      .createQueryBuilder('p')
      .addSelect('p.photoJpeg')
      .where('p.id = :id', { id })
      .andWhere('p.status = :status', { status: 'OPEN' })
      .andWhere('(p.expires_at IS NULL OR p.expires_at > NOW())')
      .getOne();
    if (!row?.photoJpeg) {
      throw new NotFoundException('Foto no encontrada');
    }
    return Buffer.isBuffer(row.photoJpeg) ? row.photoJpeg : Buffer.from(row.photoJpeg);
  }
}

function normalizeWhatsapp(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('3')) digits = `57${digits}`;
  if (digits.length < 10 || digits.length > 15) {
    throw new BadRequestException('WhatsApp inválido (usa celular con indicativo)');
  }
  return digits;
}
