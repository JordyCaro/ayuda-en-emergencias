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
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { PetReportKind, PetSpecies } from '@aee/shared-types';

class GeoPointDto {
  @IsIn(['Point'])
  type!: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}

export class CreatePetReportDto {
  @IsIn(['LOST', 'FOUND'])
  kind!: PetReportKind;

  @IsIn(['DOG', 'CAT', 'OTHER'])
  species!: PetSpecies;

  @IsString()
  @MinLength(8)
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

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactWhatsapp?: string;
}
