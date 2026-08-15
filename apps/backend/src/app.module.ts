import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SourcesModule } from './sources/sources.module';
import { EventsModule } from './events/events.module';
import { NeedsModule } from './needs/needs.module';
import { ConnectorsModule } from './connectors/connectors.module';
import { PlacesModule } from './places/places.module';
import { GeoModule } from './geo/geo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    ScheduleModule.forRoot(),
    DatabaseModule,
    HealthModule,
    SourcesModule,
    EventsModule,
    NeedsModule,
    PlacesModule,
    ConnectorsModule,
    GeoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
