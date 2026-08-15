import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { PetReportKind, PetSpecies } from '@aee/shared-types';
import { PetsService } from './pets.service';
import { CreatePetReportDto } from './dto/create-pet-report.dto';

@ApiTags('pets')
@Controller('pets')
export class PetsController {
  constructor(private readonly pets: PetsService) {}

  @Get()
  async list(
    @Query('kind') kind?: PetReportKind,
    @Query('species') species?: PetSpecies,
    @Query('cityCode') cityCode?: string,
  ) {
    const data = await this.pets.list({ kind, species, cityCode });
    return { data };
  }

  @Post()
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async create(@Body() dto: CreatePetReportDto) {
    return this.pets.create(dto);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pets.getById(id);
  }
}
