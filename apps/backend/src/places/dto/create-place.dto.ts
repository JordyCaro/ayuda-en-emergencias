import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { PlaceType } from '@aee/shared-types';

const PLACE_TYPES = [
  'HELP_CENTER',
  'DONATION_POINT',
  'SHELTER',
  'VOLUNTEER_POINT',
  'MEDICAL',
  'MEETING_POINT',
  'OTHER',
] as const;

class GeoPointDto {
  @IsIn(['Point'])
  type!: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}

export class CreatePlaceDto {
  @IsIn(PLACE_TYPES)
  type!: PlaceType;

  @IsString()
  @MaxLength(512)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ValidateNested()
  @Type(() => GeoPointDto)
  geometry!: GeoPointDto;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  @MaxLength(2000)
  externalUrl?: string;
}
