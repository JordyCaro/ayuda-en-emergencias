import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { RawRecordEntity } from './raw-record.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SourcesModule } from '../sources/sources.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity, RawRecordEntity]),
    SourcesModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, TypeOrmModule],
})
export class EventsModule {}
