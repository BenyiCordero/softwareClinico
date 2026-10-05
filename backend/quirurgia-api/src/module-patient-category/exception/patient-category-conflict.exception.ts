import { ConflictException } from '@nestjs/common';
import { PatientCategoryConflictReasonEnum } from '../enum/patient-category-conflict-reason.enum';

export class PatientCategoryConflictException extends ConflictException {
  constructor(reason: PatientCategoryConflictReasonEnum) {
    super(`Patient category ${reason} already exists`);
  }
}
