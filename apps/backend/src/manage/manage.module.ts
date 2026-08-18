import { Module } from '@nestjs/common';
import { NeedsModule } from '../needs/needs.module';
import { PlacesModule } from '../places/places.module';
import { PetsModule } from '../pets/pets.module';
import { PeopleModule } from '../people/people.module';
import { ManageController } from './manage.controller';

@Module({
  imports: [NeedsModule, PlacesModule, PetsModule, PeopleModule],
  controllers: [ManageController],
})
export class ManageModule {}
