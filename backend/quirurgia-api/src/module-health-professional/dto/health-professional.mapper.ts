import { HealthProfessional } from '../entity/health-professional.entity';
import { ProfessionalSpecialty } from '../entity/professional-specialty.entity';
import { HealthProfessionalResponseDto } from './response/health-professional-response.dto';
import { ProfessionalSpecialtyResponseDto } from './response/professional-specialty-response.dto';

export class HealthProfessionalMapper {
  static toResponseDto(professional: HealthProfessional): HealthProfessionalResponseDto {
    return {
      healthProfessionalId: professional.healthProfessionalId,
      employeeId: professional.employee.employeeId,
      professionalLicense: professional.professionalLicense,
      specialtyLicense: professional.specialtyLicense,
      bio: professional.bio,
      status: professional.status,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    };
  }

  static toSpecialtyResponseDto(specialty: ProfessionalSpecialty): ProfessionalSpecialtyResponseDto {
    return {
      professionalSpecialtyId: specialty.professionalSpecialityId,
      specialtyId: specialty.specialty.specialtyId,
      priority: specialty.priority,
    };
  }
}
