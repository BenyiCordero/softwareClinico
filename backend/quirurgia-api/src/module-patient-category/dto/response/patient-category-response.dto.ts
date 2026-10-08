import { PatientCategoryStatus } from '../../enum/patient-category-status.enum';

export class PatientCategoryResponseDto {
  patientCategoryId: number;
  name: string;
  description: string;
  status: PatientCategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
