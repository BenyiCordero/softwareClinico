import { PatientCategoryConstraintEnum } from '../enum/patient-category-constraint.enum';
import { PatientCategoryConflictReasonEnum } from '../enum/patient-category-conflict-reason.enum';
import { PatientCategoryConflictException } from '../exception/patient-category-conflict.exception';

export const PATIENT_CATEGORY_CONSTRAINT_MAP: Record<
  PatientCategoryConstraintEnum,
  () => PatientCategoryConflictException
> = {
  [PatientCategoryConstraintEnum.NAME]: () => new PatientCategoryConflictException(PatientCategoryConflictReasonEnum.NAME),
};
