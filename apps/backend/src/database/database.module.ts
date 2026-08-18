import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SourceEntity } from '../sources/source.entity';
import { RawRecordEntity } from '../events/raw-record.entity';
import { EventEntity } from '../events/event.entity';
import { NeedEntity } from '../needs/need.entity';
import { PlaceEntity } from '../places/place.entity';
import { PetReportEntity } from '../pets/pet-report.entity';
import { PersonReportEntity } from '../people/person-report.entity';
import { ModerationAuditEntity } from '../moderation/moderation-audit.entity';
import { Phase10Baseline1734220000000 } from './migrations/1734220000000-Phase10Baseline';
import { PetPhotoCommunityPlaces1734560000000 } from './migrations/1734560000000-PetPhotoCommunityPlaces';
import { PersonReports1734570000000 } from './migrations/1734570000000-PersonReports';
import { postgresSslFromUrl, postgresUrlForTypeOrm } from '../common/postgres-ssl';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const syncFlag = config.get<string>('TYPEORM_SYNCHRONIZE');
        const synchronize =
          syncFlag === 'true' ? true : syncFlag === 'false' ? false : !isProd;
        const rawUrl =
          config.get<string>('DATABASE_URL') ??
          'postgresql://aee:aee@localhost:5432/ayuda_emergencias';
        const url = postgresUrlForTypeOrm(rawUrl);
        return {
          type: 'postgres' as const,
          url,
          ssl: postgresSslFromUrl(rawUrl),
          entities: [
            SourceEntity,
            RawRecordEntity,
            EventEntity,
            NeedEntity,
            PlaceEntity,
            PetReportEntity,
            PersonReportEntity,
            ModerationAuditEntity,
          ],
          migrations: [
            Phase10Baseline1734220000000,
            PetPhotoCommunityPlaces1734560000000,
            PersonReports1734570000000,
          ],
          migrationsRun:
            isProd || config.get<string>('TYPEORM_MIGRATIONS_RUN') === 'true',
          synchronize,
          logging: config.get<string>('TYPEORM_LOGGING') === 'true',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
