import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { ManageTargetKind } from '@aee/shared-types';
import { NeedsService } from '../needs/needs.service';
import { PlacesService } from '../places/places.service';
import { PetsService } from '../pets/pets.service';
import { PeopleService } from '../people/people.service';
import { ManageCloseDto } from './dto/manage-close.dto';

@ApiTags('manage')
@Controller('manage')
export class ManageController {
  constructor(
    private readonly needs: NeedsService,
    private readonly places: PlacesService,
    private readonly pets: PetsService,
    private readonly people: PeopleService,
  ) {}

  @Get('preview')
  async preview(
    @Query('kind') kind?: string,
    @Query('id') id?: string,
    @Query('token') token?: string,
  ) {
    const k = this.parseKind(kind);
    if (!id?.trim() || !token?.trim()) {
      throw new BadRequestException('id and token required');
    }
    if (k === 'need') return this.needs.previewForManage(id, token);
    if (k === 'pet') return this.pets.previewForManage(id, token);
    if (k === 'person') return this.people.previewForManage(id, token);
    return this.places.previewForManage(id, token);
  }

  @Post('close')
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  async close(@Body() dto: ManageCloseDto) {
    if (dto.kind === 'need') {
      return this.needs.closeWithToken(dto.id, dto.manageToken);
    }
    if (dto.kind === 'pet') {
      return this.pets.closeWithToken(dto.id, dto.manageToken);
    }
    if (dto.kind === 'person') {
      return this.people.closeWithToken(dto.id, dto.manageToken);
    }
    return this.places.closeWithToken(dto.id, dto.manageToken);
  }

  private parseKind(kind?: string): ManageTargetKind {
    if (kind !== 'need' && kind !== 'pet' && kind !== 'place' && kind !== 'person') {
      throw new BadRequestException('kind must be need|pet|place|person');
    }
    return kind;
  }
}
