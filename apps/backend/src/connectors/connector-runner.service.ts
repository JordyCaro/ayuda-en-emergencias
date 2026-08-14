import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { IdeamConnector } from './ideam.connector';
import { EventsService } from '../events/events.service';
import { SourcesService } from '../sources/sources.service';
import { RawRecordEntity } from '../events/raw-record.entity';

@Injectable()
export class ConnectorRunnerService {
  private readonly logger = new Logger(ConnectorRunnerService.name);
  private running = false;

  constructor(
    private readonly ideam: IdeamConnector,
    private readonly events: EventsService,
    private readonly sources: SourcesService,
    @InjectRepository(RawRecordEntity)
    private readonly rawRepo: Repository<RawRecordEntity>,
  ) {}

  /** Every 15 minutes by default (overridable via IDEAM_POLL_CRON). */
  @Cron(process.env.IDEAM_POLL_CRON ?? '0 */15 * * * *')
  async scheduledIdeam(): Promise<void> {
    await this.runIdeam();
  }

  async runIdeam(): Promise<{ eventsUpserted: number }> {
    if (this.running) {
      this.logger.warn('IDEAM fetch already running — skip');
      return { eventsUpserted: 0 };
    }
    this.running = true;
    try {
      const { rawPayload, fetchedAt } = await this.ideam.fetch();
      if (!this.ideam.validate(rawPayload)) {
        throw new Error('IDEAM payload failed validation');
      }

      const hash = createHash('sha256')
        .update(JSON.stringify(rawPayload))
        .digest('hex');
      const raw = await this.rawRepo.save(
        this.rawRepo.create({
          sourceId: 'ideam',
          sourceRecordId: `batch:${fetchedAt.toISOString()}`,
          payload: rawPayload as Record<string, unknown>,
          retrievedAt: fetchedAt,
          contentHash: hash,
        }),
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
      return { eventsUpserted: normalized.length };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`IDEAM fetch failed: ${message}`);
      await this.sources.markFetchError('ideam', message);
      throw err;
    } finally {
      this.running = false;
    }
  }
}
