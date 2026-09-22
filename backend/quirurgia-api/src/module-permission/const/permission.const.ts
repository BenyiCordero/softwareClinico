import { PermissionConflictReasonEnum } from "../enum/permission-conflict-reason.enum";
import { PermissionConstraintEnum } from "../enum/permission-constraint.enum";
import { PermissionConflictException } from "../exception/permission-conflict.exception";

export const PERMISSION_CONSTRAINT_MAP: Record<PermissionConstraintEnum, () => PermissionConflictException> = {
  [PermissionConstraintEnum.CODE]: () => new PermissionConflictException(PermissionConflictReasonEnum.CODE),

  [PermissionConstraintEnum.RESOURCE_ACTION]: () => new PermissionConflictException(PermissionConflictReasonEnum.RESOUCE_ACTION)

};