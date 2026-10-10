import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class AssignUserRoleDto {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  roleId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  branchId?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
}
