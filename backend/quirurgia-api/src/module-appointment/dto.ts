import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  @Type(() => Number) @IsInt() @Min(1) patientId: number;
  @Type(() => Number) @IsInt() @Min(1) scheduleId: number;
  @Type(() => Number) @IsInt() @Min(1) serviceId: number;
  @IsISO8601() startAt: string;
  @IsOptional() @IsString() @Length(1, 2000) reasonForVisit?: string | null;
  @IsOptional() @IsString() @Length(1, 2000) notes?: string | null;
}

export class UpdateAppointmentNotesDto {
  @IsOptional() @IsString() @Length(1, 2000) reasonForVisit?: string | null;
  @IsOptional() @IsString() @Length(1, 2000) notes?: string | null;
}

export class RescheduleAppointmentDto {
  @IsISO8601() startAt: string;
  @IsString() @Length(2, 500) reason: string;
}

export class FindAppointmentQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) patientId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) scheduleId?: number;
  @IsOptional() @IsDateString() from?: string;
  @IsOptional() @IsDateString() to?: string;
}
