import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoleType } from '../../enum/role-type.enum';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(RoleType)
  @IsNotEmpty()
  type: RoleType;
}
