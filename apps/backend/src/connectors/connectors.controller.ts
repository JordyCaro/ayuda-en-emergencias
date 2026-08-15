import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ConnectorRunnerService } from './connector-runner.service';
import { DEFAULT_SISPRO_BBOX } from './sispro.connector';
import { SisproRunDto } from './dto/sispro-run.dto';
import { assertValidBBox } from '../common/geo';
import { OpsTokenGuard } from '../common/ops-token.guard';
import { SourcesService } from '../sources/sources.service';

@ApiTags('connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(
    private readonly runner: ConnectorRunnerService,
    private readonly sources: SourcesService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Estado en memoria + última sync de fuentes' })
  async status() {
    const sources = await this.sources.list();
    const tracked = sources.filter((s) => ['ideam', 'sispro', 'osm'].includes(s.id));
    return {
      runner: this.runner.getStatus(),
      sources: tracked.map((s) => ({
        id: s.id,
        name: s.name,
        integrationStatus: s.integrationStatus,
        lastSuccessfulFetch: s.lastSuccessfulFetch ?? null,
        lastError: s.lastError ?? null,
      })),
    };
  }

  @Post('ideam/run')
  @UseGuards(OpsTokenGuard)
  @ApiHeader({ name: 'X-Ops-Token', required: false })
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @ApiOperation({ summary: 'Sync manual IDEAM (rate-limited; OPS_TOKEN en prod)' })
  async runIdeam() {
    const result = await this.runner.runIdeam();
    return { ok: true, ...result };
  }

  @Post('sispro/run')
  @UseGuards(OpsTokenGuard)
  @ApiHeader({ name: 'X-Ops-Token', required: false })
  @Throttle({ default: { limit: 4, ttl: 60_000 } })
  @ApiOperation({ summary: 'Sync SISPRO/REPS por bbox (OPS_TOKEN en prod)' })
  async runSispro(@Body() body: SisproRunDto = {}) {
    const bbox = {
      west: body.west ?? DEFAULT_SISPRO_BBOX.west,
      south: body.south ?? DEFAULT_SISPRO_BBOX.south,
      east: body.east ?? DEFAULT_SISPRO_BBOX.east,
      north: body.north ?? DEFAULT_SISPRO_BBOX.north,
    };
    try {
      assertValidBBox(bbox, { maxSpanDeg: 8 });
    } catch (e) {
      throw new BadRequestException(e instanceof Error ? e.message : String(e));
    }
    const result = await this.runner.runSispro(bbox);
    return { ok: !result.skipped, bbox, ...result };
  }

  @Post('national/run')
  @UseGuards(OpsTokenGuard)
  @ApiHeader({ name: 'X-Ops-Token', required: false })
  @Throttle({ default: { limit: 1, ttl: 300_000 } })
  @ApiOperation({ summary: 'Sync nacional capitales (OPS_TOKEN en prod)' })
  async runNational() {
    const result = await this.runner.runNationalDirectorySync({
      includeSispro: true,
      includeOsm: true,
    });
    return { ok: !result.skipped, ...result };
  }
}
