import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeamConnector } from './ideam.connector';
import { ConnectorRunnerService } from './connector-runner.service';
import { ConnectorsController } from './connectors.controller';
import { EventsModule } from '../events/events.module';
import { SourcesModule } from '../sources/sources.module';
import { RawRecordEntity } from '../events/raw-record.entity';

@Module({
  imports: [
    EventsModule,
    SourcesModule,
    TypeOrmModule.forFeature([RawRecordEntity]),
  ],
  controllers: [ConnectorsController],
  providers: [IdeamConnector, ConnectorRunnerService],
})
export class ConnectorsModule {}
