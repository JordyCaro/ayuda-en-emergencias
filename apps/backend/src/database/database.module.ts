import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SourceEntity } from '../sources/source.entity';
import { RawRecordEntity } from '../events/raw-record.entity';
import { EventEntity } from '../events/event.entity';
import { NeedEntity } from '../needs/need.entity';
import { PlaceEntity } from '../places/place.entity';
import { PetReportEntity } from '../pets/pet-report.entity';
import { ModerationAuditEntity } from '../moderation/moderation-audit.entity';
import { Phase10Baseline1734220000000 } from './migrations/1734220000000-Phase10Baseline';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get<string>('NODE_ENV') === 'production';
        const syncFlag = config.get<string>('TYPEORM_SYNCHRONIZE');
        const synchronize =
          syncFlag === 'true' ? true : syncFlag === 'false' ? false : !isProd;
        return {
          type: 'postgres' as const,
          url:
            config.get<string>('DATABASE_URL') ??
            'postgresql://aee:aee@localhost:5432/ayuda_emergencias',
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
