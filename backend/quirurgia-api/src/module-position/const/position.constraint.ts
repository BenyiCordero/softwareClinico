import { PositionConstraintEnum } from '../enum/position-constraint.enum';
import { PositionConflictReasonEnum } from '../enum/position-conflict-reason.enum';
import { PositionConflictException } from '../exception/position-conflict.exception';

export const POSITION_CONSTRAINT_MAP: Record<
  PositionConstraintEnum,
  () => PositionConflictException
> = {
  [PositionConstraintEnum.NAME]: () =>
    new PositionConflictException(PositionConflictReasonEnum.NAME),
};
