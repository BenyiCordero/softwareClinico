import { HealthProfessionalStatus } from '../../enum/health-professional-status.enum';

export class HealthProfessionalResponseDto {
  healthProfessionalId: number;
  employeeId: number;
  professionalLicense: string;
  specialtyLicense: string | null;
  bio: string | null;
  status: HealthProfessionalStatus;
  createdAt: Date;
  updatedAt: Date;
}
