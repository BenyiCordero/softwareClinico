import { AreaConstraintEnum } from '../enum/area-constraint.enum';
import { AreaConflictReasonEnum } from '../enum/area-conflict-reason.enum';
import { AreaConflictException } from '../exception/area-conflict.exception';

export const AREA_CONSTRAINT_MAP: Record<
  AreaConstraintEnum,
  () => AreaConflictException
> = {
  [AreaConstraintEnum.BRANCH_PARENT_NAME]: () =>
    new AreaConflictException(AreaConflictReasonEnum.BRANCH_PARENT_NAME),
};
