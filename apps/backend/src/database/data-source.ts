import { DataSource } from 'typeorm';
import { SourceEntity } from '../sources/source.entity';
import { RawRecordEntity } from '../events/raw-record.entity';
import { EventEntity } from '../events/event.entity';
import { NeedEntity } from '../needs/need.entity';
import { PlaceEntity } from '../places/place.entity';
import { PetReportEntity } from '../pets/pet-report.entity';
import { ModerationAuditEntity } from '../moderation/moderation-audit.entity';
import { Phase10Baseline1734220000000 } from './migrations/1734220000000-Phase10Baseline';
import { postgresSslFromUrl } from '../common/postgres-ssl';

const url =
  process.env.DATABASE_URL ??
  'postgresql://aee:aee@localhost:5432/ayuda_emergencias';

/**
 * CLI / migraciones. No usar como único arranque Nest.
 * DATABASE_URL=postgresql://aee:aee@localhost:5432/ayuda_emergencias
 */
export default new DataSource({
  type: 'postgres',
  url,
  ssl: postgresSslFromUrl(url),
  entities: [
    SourceEntity,
    RawRecordEntity,
    EventEntity,
    NeedEntity,
    PlaceEntity,
    PetReportEntity,
    ModerationAuditEntity,
  ],
  migrations: [Phase10Baseline1734220000000],
  synchronize: false,
  logging: process.env.TYPEORM_LOGGING === 'true',
});
