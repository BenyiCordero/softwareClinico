import { ServiceCategoryConstraintEnum } from '../enum/service-category-constraint.enum';
import { ServiceCategoryConflictReasonEnum } from '../enum/service-category-conflict-reason.enum';
import { ServiceCategoryConflictException } from '../exception/service-category-conflict.exception';

export const SERVICE_CATEGORY_CONSTRAINT_MAP: Record<
  ServiceCategoryConstraintEnum,
  () => ServiceCategoryConflictException
> = {
  [ServiceCategoryConstraintEnum.PARENT_NAME]: () =>
    new ServiceCategoryConflictException(
      ServiceCategoryConflictReasonEnum.PARENT_NAME,
    ),
};
