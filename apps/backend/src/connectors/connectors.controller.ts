import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConnectorRunnerService } from './connector-runner.service';

@ApiTags('connectors')
@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly runner: ConnectorRunnerService) {}

  /** Manual trigger for local testing (dev). */
  @Post('ideam/run')
  async runIdeam() {
    const result = await this.runner.runIdeam();
    return { ok: true, ...result };
  }
}
