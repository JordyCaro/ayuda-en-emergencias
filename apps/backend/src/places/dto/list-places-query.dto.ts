import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
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

export class ListPlacesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(200_000)
  radius?: number;

  @IsOptional()
  @IsIn(PLACE_TYPES)
  type?: PlaceType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  west?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  south?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  east?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  north?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(800)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}$/)
  cityCode?: string;

  @IsOptional()
  @IsIn(['community', 'official', 'all'])
  origin?: 'community' | 'official' | 'all';

  @IsOptional()
  @IsIn(['FOOD', 'WATER', 'MEDICINE', 'CLOTHING', 'SHELTER', 'VOLUNTEER', 'BLOOD', 'OTHER'])
  tag?: string;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true' || value === '1')
  @IsBoolean()
  helpOnly?: boolean;
}
