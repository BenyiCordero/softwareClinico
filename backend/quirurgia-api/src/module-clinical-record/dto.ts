import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ClinicalDocumentStatus } from './enum/clinical-document-status.enum';
import { ClinicalRecordStatus } from './enum/clinical-record-status.enum';

export class CreateClinicalRecordDto {
  @Type(() => Number) @IsInt() @Min(1) patientId: number;
  @IsString() recordNumber: string;
  @IsDateString() openedAt: string;
  @IsEnum(ClinicalRecordStatus) status: ClinicalRecordStatus;
}
export class UpdateClinicalRecordDto {
  @IsOptional() @IsString() recordNumber?: string;
  @IsOptional() @IsEnum(ClinicalRecordStatus) status?: ClinicalRecordStatus;
}
export class CreateMedicalHistoryDto {
  @IsOptional() @IsString() familyHistory?: string;
  @IsOptional() @IsString() personalPathologicalHistory?: string;
  @IsOptional() @IsString() personalNonPathologicalHistory?: string;
  @IsOptional() @IsString() surgicalHistory?: string;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() currentMedications?: string;
  @IsOptional() @IsString() gynecologicalHistory?: string;
  @IsOptional() @IsString() notes?: string;
}
export class CreateClinicalDocumentDto {
  @Type(() => Number) @IsOptional() @IsInt() @Min(1) consultationId?: number;
  @IsString() documentType: string;
  @IsString() fileName: string;
  @IsString() storageKey: string;
  @IsString() mimeType: string;
  @IsString() fileSize: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(ClinicalDocumentStatus) status: ClinicalDocumentStatus;
}
export class UpdateClinicalDocumentDto {
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(ClinicalDocumentStatus) status?: ClinicalDocumentStatus;
}
