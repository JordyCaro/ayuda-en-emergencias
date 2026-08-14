import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { IdeamConnector } from './ideam.connector';
import {
  DEFAULT_SISPRO_BBOX,
  SisproBBox,
  SisproConnector,
} from './sispro.connector';
import { EventsService } from '../events/events.service';
import { SourcesService } from '../sources/sources.service';
import { PlacesService } from '../places/places.service';
import { RawRecordEntity } from '../events/raw-record.entity';

export interface SisproRunResult {
  placesUpserted: number;
  skipped: boolean;
  truncated: boolean;
  fetched: number;
}

@Injectable()
export class ConnectorRunnerService {
  private readonly logger = new Logger(ConnectorRunnerService.name);
  private ideamRunning = false;
  private sisproRunning = false;

  constructor(
    private readonly ideam: IdeamConnector,
    private readonly sispro: SisproConnector,
    private readonly events: EventsService,
    private readonly places: PlacesService,
    private readonly sources: SourcesService,
    @InjectRepository(RawRecordEntity)
    private readonly rawRepo: Repository<RawRecordEntity>,
  ) {}

  @Cron(process.env.IDEAM_POLL_CRON ?? '0 */15 * * * *')
  async scheduledIdeam(): Promise<void> {
    await this.runIdeam();
  }

  /** Sync SISPRO around Bogotá every 6h (bbox fijo; el mapa pide sync on-demand). */
  @Cron(process.env.SISPRO_POLL_CRON ?? '0 0 */6 * * *')
  async scheduledSispro(): Promise<void> {
    await this.runSispro(DEFAULT_SISPRO_BBOX);
  }

  /** Expira places comunitarios con expiresAt pasado (cada hora). */
  @Cron(process.env.PLACES_EXPIRE_CRON ?? '0 15 * * * *')
  async scheduledExpirePlaces(): Promise<void> {
    const n = await this.places.expireStale();
    if (n > 0) this.logger.log(`Expired ${n} stale places`);
  }

  async runIdeam(): Promise<{ eventsUpserted: number; skipped: boolean }> {
    if (this.ideamRunning) {
      this.logger.warn('IDEAM fetch already running — skip');
      return { eventsUpserted: 0, skipped: true };
    }
    this.ideamRunning = true;
    try {
      const { rawPayload, fetchedAt } = await this.ideam.fetch();
      if (!this.ideam.validate(rawPayload)) {
        throw new Error('IDEAM payload failed validation');
      }

      const hash = createHash('sha256')
        .update(JSON.stringify(rawPayload))
        .digest('hex');
      const raw = await this.rawRepo.save(
        this.repoCreateRaw('ideam', `batch:${fetchedAt.toISOString()}`, rawPayload, fetchedAt, hash),
      );

      const normalized = this.ideam.normalize(rawPayload, fetchedAt);
      for (const item of normalized) {
        await this.events.upsertNormalized({
          ...item,
          rawRecordId: raw.id,
        });
      }

      await this.sources.markFetchSuccess('ideam');
      this.logger.log(`IDEAM OK — ${normalized.length} events upserted`);
      return { eventsUpserted: normalized.length, skipped: false };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`IDEAM fetch failed: ${message}`);
      await this.sources.markFetchError('ideam', message);
      throw err;
    } finally {
      this.ideamRunning = false;
    }
  }

  async runSispro(bbox: SisproBBox = DEFAULT_SISPRO_BBOX): Promise<SisproRunResult> {
    if (this.sisproRunning) {
      this.logger.warn('SISPRO fetch already running — skip');
      return { placesUpserted: 0, skipped: true, truncated: false, fetched: 0 };
    }
    this.sisproRunning = true;
    try {
      const { rawPayload, fetchedAt } = await this.sispro.fetch(bbox);
      if (!this.sispro.validate(rawPayload)) {
        throw new Error('SISPRO payload failed validation');
      }

      const truncated = Boolean(
        (rawPayload as { truncated?: boolean }).truncated,
      );
      const hash = createHash('sha256')
        .update(JSON.stringify({ bbox, count: (rawPayload as { features?: unknown[] }).features?.length }))
        .digest('hex');
      await this.rawRepo.save(
        this.repoCreateRaw(
          'sispro',
          `bbox:${fetchedAt.toISOString()}`,
          {
            bbox,
            truncated,
            featureCount: (rawPayload as { features?: unknown[] }).features?.length ?? 0,
          },
          fetchedAt,
          hash,
        ),
      );

      const places = this.sispro.extractPlaces(rawPayload, fetchedAt);
      const placesUpserted = await this.places.upsertOfficialBatch(
        places.map((p) => ({
          type: 'MEDICAL' as const,
          title: p.title,
          description: p.description,
          lat: p.lat,
          lng: p.lng,
          sourceId: 'sispro',
          sourceRecordId: p.sourceRecordId,
          verification: 'OFFICIAL' as const,
          address: p.address,
          municipality: p.municipality,
          department: p.department,
          externalUrl: p.externalUrl,
          retrievedAt: p.retrievedAt,
          properties: p.properties,
        })),
      );

      await this.sources.markFetchSuccess('sispro');
      this.logger.log(
        `SISPRO OK — ${placesUpserted} places upserted` +
          (truncated ? ' (truncated: hit page cap)' : ''),
      );
      return {
        placesUpserted,
        skipped: false,
        truncated,
        fetched: places.length,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`SISPRO fetch failed: ${message}`);
      await this.sources.markFetchError('sispro', message);
      throw err;
    } finally {
      this.sisproRunning = false;
    }
  }

  private repoCreateRaw(
    sourceId: string,
    sourceRecordId: string,
    payload: unknown,
    retrievedAt: Date,
    contentHash: string,
  ) {
    return this.rawRepo.create({
      sourceId,
      sourceRecordId,
      payload: payload as Record<string, unknown>,
      retrievedAt,
      contentHash,
    });
  }
}
