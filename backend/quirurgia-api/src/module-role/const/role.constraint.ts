import { RoleConflictReasonEnum } from '../enum/role-conflict-reason.enum';
import { RoleConstraintEnum } from '../enum/role-constraint.enum';
import { RoleConflictException } from '../exception/role-conflict.exception';

export const ROLE_CONSTRAINT_MAP: Record<
  RoleConstraintEnum,
  () => RoleConflictException
> = {
  [RoleConstraintEnum.NAME]: () =>
    new RoleConflictException(RoleConflictReasonEnum.NAME),
};
