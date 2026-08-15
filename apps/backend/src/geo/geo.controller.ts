import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { searchCities } from './cities.seed';

@ApiTags('geo')
@Controller('geo')
export class GeoController {
  @Get('cities')
  @ApiOperation({ summary: 'Catálogo DIVIPOLA (subset) para filtro / publicación' })
  list(@Query('q') q?: string, @Query('limit') limit?: string) {
    const lim = limit != null ? Number(limit) : 40;
    const data = searchCities(q, Number.isFinite(lim) ? lim : 40);
    return { data };
  }
}
