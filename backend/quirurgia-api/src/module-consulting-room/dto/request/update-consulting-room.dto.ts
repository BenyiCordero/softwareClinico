import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min, ValidateIf } from 'class-validator';
import { ConsultingRoomStatus } from '../../enum/consulting-room-status.enum';

export class UpdateConsultingRoomDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  branchId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  areaId?: number | null;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 50)
  code?: string;

  @ValidateIf((_, value) => value !== null)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(1, 50)
  floor?: string | null;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @Length(2, 500)
  description?: string;

  @IsOptional()
  @IsEnum(ConsultingRoomStatus)
  status?: ConsultingRoomStatus;
}
