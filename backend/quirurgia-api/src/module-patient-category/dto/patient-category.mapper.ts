import { PatientCategory } from '../entity/patient-category.entity';
import { PatientCategoryResponseDto } from './response/patient-category-response.dto';

export class PatientCategoryMapper {
  static toResponseDto(category: PatientCategory): PatientCategoryResponseDto {
    return {
      patientCategoryId: category.patientCategoryId,
      name: category.name,
      description: category.description,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
