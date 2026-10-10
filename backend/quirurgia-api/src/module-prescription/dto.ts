import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PrescriptionStatus } from './enum/prescription-status.enum';
export class CreatePrescriptionDto {
  @Type(() => Number) @IsInt() @Min(1) consultationId: number;
  @Type(() => Number) @IsInt() @Min(1) healthProfessionalId: number;
  @IsDateString() issuedAt: string;
  @IsOptional() @IsString() notes?: string;
  @IsEnum(PrescriptionStatus) status: PrescriptionStatus;
}
export class UpdatePrescriptionDto {
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsEnum(PrescriptionStatus) status?: PrescriptionStatus;
}
export class CreatePrescriptionItemDto {
  @IsString() medication: string;
  @IsOptional() @IsString() presentation?: string;
  @IsString() dose: string;
  @IsOptional() @IsString() route?: string;
  @IsString() frequency: string;
  @IsString() duration: string;
  @IsOptional() @IsString() instructions?: string;
}
