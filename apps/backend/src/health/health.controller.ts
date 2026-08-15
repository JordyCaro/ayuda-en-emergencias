import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /** Compat + summary. */
  @Get()
  async getHealth() {
    const database = await this.dbStatus();
    return {
      status: database === 'up' ? 'ok' : 'degraded',
      database,
      service: 'ayuda-en-emergencias-api',
      timestamp: new Date().toISOString(),
    };
  }

  /** Liveness: proceso proceso (orquestadores). */
  @Get('live')
  live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  /** Readiness: DB alcanzable. */
  @Get('ready')
  async ready() {
    const database = await this.dbStatus();
    if (database !== 'up') {
      throw new ServiceUnavailableException({ status: 'not_ready', database });
    }
    return { status: 'ready', database, timestamp: new Date().toISOString() };
  }

  private async dbStatus(): Promise<'up' | 'down'> {
    try {
      await this.dataSource.query('SELECT 1');
      return 'up';
    } catch {
      return 'down';
    }
  }
}
