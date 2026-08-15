import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { NeedCategory, NeedIntent } from '@aee/shared-types';

const NEED_CATEGORIES = [
  'HELP',
  'WATER',
  'FOOD',
  'SHELTER',
  'MEDICAL',
  'TRANSPORT',
  'COMMUNICATION',
  'VOLUNTEER',
  'CLOTHING',
  'BLOOD',
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

export class CreateNeedDto {
  @IsIn(NEED_CATEGORIES)
  category!: NeedCategory;

  @IsIn(['NEED', 'OFFER'])
  intent!: NeedIntent;

  @IsString()
  @MaxLength(2000)
  description!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  geometry?: GeoPointDto;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}$/, { message: 'cityCode must be 5 digits' })
  cityCode?: string;

  /** Celular CO: 10 dígitos (3xx…) o con 57. */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactWhatsapp?: string;
}
