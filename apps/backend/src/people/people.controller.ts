import { Body, Controller, Get, Header, Param, ParseUUIDPipe, Post, Query, StreamableFile } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { PersonReportKind } from '@aee/shared-types';
import { PeopleService } from './people.service';
import { CreatePersonReportDto } from './dto/create-person-report.dto';

@ApiTags('people')
@Controller('people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}

  @Get()
  async list(
    @Query('kind') kind?: PersonReportKind,
    @Query('cityCode') cityCode?: string,
  ) {
    const data = await this.people.list({ kind, cityCode });
    return { data };
  }

  @Post()
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  async create(@Body() dto: CreatePersonReportDto) {
    return this.people.create(dto);
  }

  @Get(':id/photo')
  @Header('Content-Type', 'image/jpeg')
  @Header('Cache-Control', 'public, max-age=86400')
  async photo(@Param('id', ParseUUIDPipe) id: string) {
    const buf = await this.people.getPhotoJpeg(id);
    return new StreamableFile(buf);
  }

  @Get(':id')
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.people.getById(id);
  }
}
