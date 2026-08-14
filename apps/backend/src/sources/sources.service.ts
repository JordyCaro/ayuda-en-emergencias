import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { SourceDto } from '@aee/shared-types';
import { SourceEntity } from './source.entity';

const DEFAULT_SOURCES: Array<Partial<SourceEntity> & { id: string; name: string }> = [
  {
    id: 'ideam',
    name: 'IDEAM — Alarma de niveles (OSPA)',
    type: 'OFFICIAL',
    tier: 1,
    country: 'CO',
    url: 'http://www.ideam.gov.co/',
    apiUrl:
      'http://dhime.ideam.gov.co/server/rest/services/OSPA/Alarma_Niveles/MapServer',
    license: 'Datos oficiales IDEAM (verificar términos de uso)',
    attributionRequired: true,
    updateFrequency: 'NEAR_REAL_TIME',
    integrationStatus: 'TESTING',
    notes: 'Connector #1 del MVP 001. Capas 0/1/2 MapServer.',
  },
  {
    id: 'sgc',
    name: 'Servicio Geológico Colombiano — Sismos',
    type: 'OFFICIAL',
    tier: 1,
    country: 'CO',
    url: 'https://sgc.gov.co/sismos',
    apiUrl: null,
    license: 'Ver términos SGC',
    attributionRequired: true,
    updateFrequency: 'NEAR_REAL_TIME',
    integrationStatus: 'BLOCKED',
    notes: 'Query features bloqueado en Fase 0. Deep-link al visor oficial.',
  },
  {
    id: 'osm',
    name: 'OpenStreetMap (tiles / atribución)',
    type: 'OPEN_DATA',
    tier: 2,
    country: 'CO',
    url: 'https://www.openstreetmap.org/copyright',
    license: 'ODbL',
    attributionRequired: true,
    updateFrequency: 'UNKNOWN',
    integrationStatus: 'INTEGRATED',
    notes: 'Tiles de mapa en el frontend. No es capa de alertas.',
  },
];

@Injectable()
export class SourcesService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly repo: Repository<SourceEntity>,
  ) {}

  async seedDefaults(): Promise<void> {
    for (const seed of DEFAULT_SOURCES) {
      const existing = await this.repo.findOne({ where: { id: seed.id } });
      if (!existing) {
        await this.repo.save(this.repo.create(seed));
      }
    }
  }

  async list(): Promise<SourceDto[]> {
    const rows = await this.repo.find({ order: { tier: 'ASC', name: 'ASC' } });
    return rows.map((s) => this.toDto(s));
  }

  async getById(id: string): Promise<SourceEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async markFetchSuccess(id: string): Promise<void> {
    await this.repo.update(id, {
      lastSuccessfulFetch: new Date(),
      lastError: null,
      integrationStatus: 'INTEGRATED',
    });
  }

  async markFetchError(id: string, message: string): Promise<void> {
    await this.repo.update(id, { lastError: message.slice(0, 2000) });
  }

  private toDto(s: SourceEntity): SourceDto {
    return {
      id: s.id,
      name: s.name,
      type: s.type,
      tier: s.tier,
      country: s.country,
      url: s.url,
      license: s.license,
      updateFrequency: s.updateFrequency,
      integrationStatus: s.integrationStatus,
      lastSuccessfulFetch: s.lastSuccessfulFetch?.toISOString() ?? null,
      attributionRequired: s.attributionRequired,
    };
  }
}
