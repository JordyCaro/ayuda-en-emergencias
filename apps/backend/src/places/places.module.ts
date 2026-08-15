import { Injectable, Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceEntity } from './place.entity';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { CURATED_HELP_PLACES } from './curated-places.seed';

@Injectable()
class CuratedPlacesSeeder implements OnModuleInit {
  private readonly logger = new Logger(CuratedPlacesSeeder.name);

  constructor(private readonly places: PlacesService) {}

  async onModuleInit(): Promise<void> {
    const now = new Date();
    let n = 0;
    for (const c of CURATED_HELP_PLACES) {
      await this.places.upsertOfficial({
        type: c.type,
        title: c.title,
        description: c.description,
        lat: c.lat,
        lng: c.lng,
        sourceId: 'curated',
        sourceRecordId: c.sourceRecordId,
        verification: 'UNVERIFIED',
        municipality: c.municipality,
        department: c.department,
        cityCode: c.cityCode,
        externalUrl: c.externalUrl,
        needTags: c.needTags,
        retrievedAt: now,
        properties: { origin: 'CURATED_SEED', national: true },
      });
      n += 1;
    }
    this.logger.log(`Curated national help places upserted: ${n}`);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([PlaceEntity])],
  controllers: [PlacesController],
  providers: [PlacesService, CuratedPlacesSeeder],
  exports: [PlacesService, TypeOrmModule],
})
export class PlacesModule {}
