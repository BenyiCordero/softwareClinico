import { SpecialtyConstraintEnum } from '../enum/specialty-constraint.enum';
import { SpecialtyConflictReasonEnum } from '../enum/specialty-conflict-reason.enum';
import { SpecialtyConflictException } from '../exception/specialty-conflict.exception';

export const SPECIALTY_CONSTRAINT_MAP: Record<SpecialtyConstraintEnum, () => SpecialtyConflictException> = {
  [SpecialtyConstraintEnum.NAME]: () => new SpecialtyConflictException(SpecialtyConflictReasonEnum.NAME),
};
