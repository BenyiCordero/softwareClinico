import { ConflictException } from '@nestjs/common';
import { ServiceCategoryConflictReasonEnum } from '../enum/service-category-conflict-reason.enum';

export class ServiceCategoryConflictException extends ConflictException {
  constructor(reason: ServiceCategoryConflictReasonEnum) {
    super(`Service category ${reason} already exists`);
  }
}
