import { ServiceCategory } from '../entity/service-category.entity';
import { ServiceCategoryResponseDto } from './response/service-category-response.dto';

export class ServiceCategoryMapper {
  static toResponseDto(category: ServiceCategory): ServiceCategoryResponseDto {
    return {
      serviceCategoryId: category.serviceCategoryId,
      parentCategoryId: category.parentCategory?.serviceCategoryId ?? null,
      name: category.name,
      description: category.description,
      status: category.status,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
