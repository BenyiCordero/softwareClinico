import { ServiceCategoryStatus } from '../../enum/service-category-status.enum';

export class ServiceCategoryResponseDto {
  serviceCategoryId: number;
  parentCategoryId: number | null;
  name: string;
  description: string;
  status: ServiceCategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
