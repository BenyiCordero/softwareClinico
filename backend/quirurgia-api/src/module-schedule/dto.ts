import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsISO8601, IsOptional, IsString, Length, Max, Min } from 'class-validator';
import { DayOfWeek } from './enum/day-of-week.enum';
import { ScheduleBlockType } from './enum/schedule-block-type.enum';
import { ScheduleStatus } from './enum/schedule-status.enum';
import { ScheduleHourStatus } from './enum/schedule-hour-status.enum';

export class CreateScheduleDto {
  @Type(() => Number) @IsInt() @Min(1) healthProfessionalId: number;
  @Type(() => Number) @IsInt() @Min(1) branchId: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) consultingRoomId?: number;
  @IsString() @Length(2, 150) name: string;
  @Type(() => Number) @IsInt() @Min(5) @Max(480) slotDurationMinutes: number;
}

export class UpdateScheduleDto {
  @IsOptional() @IsString() @Length(2, 150) name?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(5) @Max(480) slotDurationMinutes?: number;
  @IsOptional() @IsEnum(ScheduleStatus) status?: ScheduleStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) consultingRoomId?: number | null;
}

export class CreateScheduleHourDto {
  @IsEnum(DayOfWeek) dayOfWeek: DayOfWeek;
  @IsString() startTime: string;
  @IsString() endTime: string;
  @IsDateString() validFrom: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
}

export class UpdateScheduleHourDto {
  @IsOptional() @IsEnum(DayOfWeek) dayOfWeek?: DayOfWeek;
  @IsOptional() @IsString() startTime?: string;
  @IsOptional() @IsString() endTime?: string;
  @IsOptional() @IsDateString() validFrom?: string;
  @IsOptional() @IsDateString() validUntil?: string | null;
  @IsOptional() @IsEnum(ScheduleHourStatus) status?: ScheduleHourStatus;
}

export class CreateScheduleBlockDto {
  @IsISO8601() startAt: string;
  @IsISO8601() endAt: string;
  @IsString() @Length(2, 500) reason: string;
  @IsEnum(ScheduleBlockType) blockType: ScheduleBlockType;
}

export class FindScheduleQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) branchId?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) healthProfessionalId?: number;
  @IsOptional() @IsEnum(ScheduleStatus) status?: ScheduleStatus;
}

export class AvailabilityQueryDto {
  @IsDateString() date: string;
}
