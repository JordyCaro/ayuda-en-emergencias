import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from '../places/place.entity';
import { NeedEntity } from '../needs/need.entity';
import { PetReportEntity } from '../pets/pet-report.entity';
import { PersonReportEntity } from '../people/person-report.entity';
import { ModerationAuditEntity } from './moderation-audit.entity';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { ModerationTokenGuard } from './moderation-token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PlaceEntity,
      NeedEntity,
      PetReportEntity,
      PersonReportEntity,
      ModerationAuditEntity,
    ]),
  ],
  controllers: [ModerationController],
  providers: [ModerationService, ModerationTokenGuard],
})
export class ModerationModule {}
