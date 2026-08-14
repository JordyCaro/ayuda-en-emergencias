import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { EventType } from '@aee/shared-types';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  @ApiOkResponse({ description: 'Normalized events' })
  async list(
    @Query('country') country?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
    @Query('type') type?: EventType,
    @Query('updatedSince') updatedSince?: string,
  ) {
    const data = await this.events.list({
      country,
      lat: lat != null ? Number(lat) : undefined,
      lng: lng != null ? Number(lng) : undefined,
      radius: radius != null ? Number(radius) : undefined,
      type,
      updatedSince,
    });
    return { data };
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.events.getById(id);
  }
}
