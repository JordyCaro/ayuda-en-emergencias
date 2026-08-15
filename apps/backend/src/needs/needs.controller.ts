import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { NeedCategory, NeedIntent } from '@aee/shared-types';
import { NeedsService } from './needs.service';
import { CreateNeedDto } from './dto/create-need.dto';

@ApiTags('needs')
@Controller('needs')
export class NeedsController {
  constructor(private readonly needs: NeedsService) {}

  @Get()
  async list(
    @Query('country') country?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
    @Query('category') category?: NeedCategory,
    @Query('intent') intent?: NeedIntent,
    @Query('cityCode') cityCode?: string,
  ) {
    const data = await this.needs.list({
      country,
      lat: lat != null ? Number(lat) : undefined,
      lng: lng != null ? Number(lng) : undefined,
      radius: radius != null ? Number(radius) : undefined,
      category,
      intent,
      cityCode,
    });
    return { data };
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async create(@Body() dto: CreateNeedDto) {
    return this.needs.create(dto);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.needs.getById(id);
  }
}
