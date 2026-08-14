import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { EventDto, EventType } from '@aee/shared-types';
import { EventEntity } from './event.entity';
import { SourcesService } from '../sources/sources.service';

export interface ListEventsQuery {
  country?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  type?: EventType;
  updatedSince?: string;
}

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly repo: Repository<EventEntity>,
    private readonly sources: SourcesService,
  ) {}

  async list(query: ListEventsQuery): Promise<EventDto[]> {
    const qb = this.repo
      .createQueryBuilder('e')
      .leftJoinAndSelect('e.source', 's')
      .orderBy('e.retrievedAt', 'DESC')
      .take(500);

    if (query.type) {
      qb.andWhere('e.type = :type', { type: query.type });
    }
    if (query.updatedSince) {
      qb.andWhere('e.retrieved_at >= :since', {
        since: new Date(query.updatedSince),
      });
    }
    if (
      query.lat != null &&
      query.lng != null &&
      query.radius != null &&
      query.radius > 0
    ) {
      // Haversine approx in meters (MVP; PostGIS ST_DWithins later)
      qb.andWhere('e.lat IS NOT NULL AND e.lng IS NOT NULL');
      qb.andWhere(
        `(
          6371000 * acos(
            least(1, greatest(-1,
              cos(radians(:lat)) * cos(radians(e.lat)) *
              cos(radians(e.lng) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(e.lat))
            ))
          )
        ) <= :radius`,
        { lat: query.lat, lng: query.lng, radius: query.radius },
      );
    }

    const rows = await qb.getMany();
    return rows.map((e) => this.toDto(e));
  }

  async getById(id: string): Promise<EventDto> {
    const e = await this.repo.findOne({
      where: { id },
      relations: ['source'],
    });
    if (!e) throw new NotFoundException(`Event ${id} not found`);
    return this.toDto(e);
  }

  async upsertNormalized(input: {
    type: EventEntity['type'];
    originalType?: string | null;
    sourceId: string;
    sourceRecordId: string;
    title?: string | null;
    summary?: string | null;
    geometry?: Record<string, unknown> | null;
    lat?: number | null;
    lng?: number | null;
    observedAt?: Date | null;
    publishedAt?: Date | null;
    retrievedAt: Date;
    verification: EventEntity['verification'];
    rawRecordId?: string | null;
    properties?: Record<string, unknown>;
  }): Promise<EventEntity> {
    let row = await this.repo.findOne({
      where: {
        sourceId: input.sourceId,
        sourceRecordId: input.sourceRecordId,
      },
    });
    if (!row) {
      row = this.repo.create({
        ...input,
        lastSeenAt: input.retrievedAt,
        properties: input.properties ?? {},
      });
    } else {
      Object.assign(row, {
        ...input,
        lastSeenAt: input.retrievedAt,
        properties: input.properties ?? row.properties,
      });
    }
    return this.repo.save(row);
  }

  private toDto(e: EventEntity): EventDto {
    return {
      id: e.id,
      type: e.type,
      originalType: e.originalType,
      sourceId: e.sourceId,
      sourceName: e.source?.name,
      title: e.title,
      summary: e.summary,
      geometry: e.geometry,
      observedAt: e.observedAt?.toISOString() ?? null,
      publishedAt: e.publishedAt?.toISOString() ?? null,
      retrievedAt: e.retrievedAt.toISOString(),
      verification: e.verification,
    };
  }
}
