import { RolePermissionConstraintEnum } from "../enum/role-permission-constraint.enum";
import { RolePermissionConflictException } from "../exception/role-permission-conflict.exception";
import { RolePermissionConflictReasonEnum } from "../enum/role-permission-conflict-reason.enum";

export const ROLE_PERMISSION_CONSTRAINT_MAP: Record<RolePermissionConstraintEnum, () => RolePermissionConflictException> = {
  [RolePermissionConstraintEnum.PERMISSION_ROLE]: () =>
    new RolePermissionConflictException(RolePermissionConflictReasonEnum.PERMISSION_ROLE)
};