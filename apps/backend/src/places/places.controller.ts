import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { ListPlacesQueryDto } from './dto/list-places-query.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly places: PlacesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar lugares activos (bbox o radio)' })
  async list(@Query() query: ListPlacesQueryDto) {
    return this.places.list(query);
  }

  @Post()
  @Throttle({ default: { limit: 8, ttl: 60_000 } })
  @ApiOperation({ summary: 'Publicar lugar comunitario (UNVERIFIED)' })
  async create(@Body() body: CreatePlaceDto) {
    return this.places.createCommunity(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalle de un lugar' })
  async getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.places.getById(id);
  }
}
