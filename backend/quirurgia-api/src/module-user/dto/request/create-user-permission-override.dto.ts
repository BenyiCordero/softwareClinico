import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { PermissionEffect } from '../../enum/permission-effect.enum';

export class CreateUserPermissionOverrideDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  permissionId!: number;

  @IsNotEmpty()
  @IsEnum(PermissionEffect)
  effect!: PermissionEffect;

  @IsOptional()
  @IsInt()
  @Min(1)
  branchId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  reason?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
}
