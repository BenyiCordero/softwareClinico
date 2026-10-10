import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ConsultationStatus } from './enum/consultation-status.enum';
import { DiagnosisPriority } from './enum/diagnosis-priority.enum';
import { DiagnosisType } from './enum/diagnosis-type.enum';
import { TreatmentStatus } from './enum/treatment-status.enum';
import { ClinicalNoteStatus } from './enum/clinical-note-status.enum';
import { ClinicalNoteType } from './enum/clinical-note-type.enum';
export class CreateConsultationDto {
  @Type(() => Number) @IsInt() @Min(1) clinicalRecordId: number;
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) appointmentId?: number;
  @Type(() => Number) @IsInt() @Min(1) healthProfessionalId: number;
  @Type(() => Number) @IsInt() @Min(1) branchId: number;
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) consultingRoomId?: number;
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) serviceId?: number;
  @IsString() reason: string;
  @IsOptional() @IsString() clinicalSummary?: string;
  @IsDateString() startedAt: string;
  @IsEnum(ConsultationStatus) status: ConsultationStatus;
}
export class UpdateConsultationDto {
  @IsOptional() @IsString() reason?: string;
  @IsOptional() @IsString() clinicalSummary?: string;
  @IsOptional() @IsEnum(ConsultationStatus) status?: ConsultationStatus;
  @IsOptional() @IsDateString() finishedAt?: string;
}
export class CreateDiagnosisDto {
  @IsOptional() @IsString() code?: string;
  @IsString() description: string;
  @IsEnum(DiagnosisType) diagnosisType: DiagnosisType;
  @IsEnum(DiagnosisPriority) priority: DiagnosisPriority;
  @IsOptional() @IsString() notes?: string;
}
export class CreateTreatmentDto {
  @IsString() name: string;
  @IsString() description: string;
  @IsString() instructions: string;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsEnum(TreatmentStatus) status: TreatmentStatus;
}
export class CreateClinicalNoteDto {
  @Type(() => Number) @IsInt() @Min(1) healthProfessionalId: number;
  @IsEnum(ClinicalNoteType) noteType: ClinicalNoteType;
  @IsString() content: string;
  @IsEnum(ClinicalNoteStatus) status: ClinicalNoteStatus;
}
