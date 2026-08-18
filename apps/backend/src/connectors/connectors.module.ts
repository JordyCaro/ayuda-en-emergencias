import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeamConnector } from './ideam.connector';
import { SisproConnector } from './sispro.connector';
import { OsmHelpConnector } from './osm-help.connector';
import { ConnectorRunnerService } from './connector-runner.service';
import { ConnectorsController } from './connectors.controller';
import { EventsModule } from '../events/events.module';
import { SourcesModule } from '../sources/sources.module';
import { PlacesModule } from '../places/places.module';
import { NeedsModule } from '../needs/needs.module';
import { PetsModule } from '../pets/pets.module';
import { PeopleModule } from '../people/people.module';
import { RawRecordEntity } from '../events/raw-record.entity';
import { OpsTokenGuard } from '../common/ops-token.guard';

@Module({
  imports: [
    EventsModule,
    SourcesModule,
    PlacesModule,
    NeedsModule,
    PetsModule,
    PeopleModule,
    TypeOrmModule.forFeature([RawRecordEntity]),
  ],
  controllers: [ConnectorsController],
  providers: [
    IdeamConnector,
    SisproConnector,
    OsmHelpConnector,
    ConnectorRunnerService,
    OpsTokenGuard,
  ],
})
export class ConnectorsModule implements OnModuleInit {
  constructor(private readonly runner: ConnectorRunnerService) {}

  onModuleInit(): void {
    void this.runner.warmOsmHelp();
    void this.runner.scheduledExpirePlaces();
  }
}
