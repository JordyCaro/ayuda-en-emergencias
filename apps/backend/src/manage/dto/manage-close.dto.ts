import { IsIn, IsString, IsUUID, MinLength } from 'class-validator';
import type { ManageTargetKind } from '@aee/shared-types';

export class ManageCloseDto {
  @IsIn(['place', 'need', 'pet', 'person'])
  kind!: ManageTargetKind;

  @IsUUID()
  id!: string;

  @IsString()
  @MinLength(16)
  manageToken!: string;
}
