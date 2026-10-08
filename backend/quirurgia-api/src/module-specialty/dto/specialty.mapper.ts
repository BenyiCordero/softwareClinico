import { Specialty } from '../entity/specialty.entity';
import { SpecialtyResponseDto } from './response/specialty-response.dto';

export class SpecialtyMapper {
  static toResponseDto(specialty: Specialty): SpecialtyResponseDto {
    return {
      specialtyId: specialty.specialtyId,
      name: specialty.name,
      description: specialty.description,
      status: specialty.status,
    };
  }
}
