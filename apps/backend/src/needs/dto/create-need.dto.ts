import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { NeedCategory } from '@aee/shared-types';

const NEED_CATEGORIES = [
  'HELP',
  'WATER',
  'FOOD',
  'SHELTER',
  'MEDICAL',
  'TRANSPORT',
  'COMMUNICATION',
  'VOLUNTEER',
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

  @IsString()
  @MaxLength(2000)
  description!: string;

  @ValidateNested()
  @Type(() => GeoPointDto)
  geometry!: GeoPointDto;
}
