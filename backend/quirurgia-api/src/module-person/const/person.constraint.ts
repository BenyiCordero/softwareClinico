import { PersonConflictReasonEnum } from '../enum/person-conflict-reason.enum';
import { PersonConstraintEnum } from '../enum/person-constraint.enum';
import { PersonConflictException } from '../exception/person-conflict.exception';

export const PERSON_CONSTRAINT_MAP: Record<
  PersonConstraintEnum,
  () => PersonConflictException
> = {
  [PersonConstraintEnum.CURP]: () =>
    new PersonConflictException(PersonConflictReasonEnum.CURP),
  [PersonConstraintEnum.RFC]: () =>
    new PersonConflictException(PersonConflictReasonEnum.RFC),
};
