import { IsOptional, IsString, MaxLength } from 'class-validator';

export class ModerateDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
