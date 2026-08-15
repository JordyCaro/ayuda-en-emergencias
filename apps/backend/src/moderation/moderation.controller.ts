import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { ModerationTargetKind } from '@aee/shared-types';
import { ModerationService } from './moderation.service';
import { ModerationTokenGuard } from './moderation-token.guard';
import { ModerateDto } from './dto/moderate.dto';

@ApiTags('moderation')
@ApiHeader({ name: 'X-Moderation-Token', required: true })
@UseGuards(ModerationTokenGuard)
@Controller('moderation')
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Get('queue')
  async queue(@Query('kind') kind?: ModerationTargetKind) {
    if (kind) this.assertKind(kind);
    const data = await this.moderation.queue(kind);
    return { data };
  }

  @Get('audits')
  async audits() {
    const data = await this.moderation.recentAudits();
    return { data };
  }

  @Post(':kind/:id/verify')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async verify(
    @Param('kind') kind: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerateDto,
  ) {
    this.assertKind(kind);
    return this.moderation.verify(kind, id, dto.note);
  }

  @Post(':kind/:id/hide')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  async hide(
    @Param('kind') kind: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ModerateDto,
  ) {
    this.assertKind(kind);
    return this.moderation.hide(kind, id, dto.note);
  }

  private assertKind(kind: string): asserts kind is ModerationTargetKind {
    if (kind !== 'place' && kind !== 'need' && kind !== 'pet') {
      throw new BadRequestException('kind must be place|need|pet');
    }
  }
}
