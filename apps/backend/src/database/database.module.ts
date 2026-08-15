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

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
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
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('TYPEORM_LOGGING') === 'true',
      }),
    }),
  ],
})
export class DatabaseModule {}
