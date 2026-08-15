import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ConnectorRunnerService } from './connector-runner.service';
import { DEFAULT_SISPRO_BBOX } from './sispro.connector';
import { SisproRunDto } from './dto/sispro-run.dto';
import { assertValidBBox } from '../common/geo';

@ApiTags('connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly runner: ConnectorRunnerService) {}

  @Post('ideam/run')
  @Throttle({ default: { limit: 6, ttl: 60_000 } })
  @ApiOperation({ summary: 'Sync manual IDEAM (rate-limited)' })
  async runIdeam() {
    const result = await this.runner.runIdeam();
    return { ok: true, ...result };
  }

  /** Sync sedes IPS (SISPRO) for a map bbox. Default: Bogotá. */
  @Post('sispro/run')
  @Throttle({ default: { limit: 4, ttl: 60_000 } })
  @ApiOperation({ summary: 'Sync SISPRO/REPS por bbox (rate-limited)' })
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

  /** Barrido nacional: capitales SISPRO + OSM help (rate-limited). */
  @Post('national/run')
  @Throttle({ default: { limit: 1, ttl: 300_000 } })
  @ApiOperation({ summary: 'Sync nacional por capitales (SISPRO + OSM help)' })
  async runNational() {
    const result = await this.runner.runNationalDirectorySync({
      includeSispro: true,
      includeOsm: true,
    });
    return { ok: !result.skipped, ...result };
  }
}
