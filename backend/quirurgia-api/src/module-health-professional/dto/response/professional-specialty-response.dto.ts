import { SpecialtyPriority } from '../../enum/specialty-priority.enum';

export class ProfessionalSpecialtyResponseDto {
  professionalSpecialtyId: number;
  specialtyId: number;
  priority: SpecialtyPriority;
}
