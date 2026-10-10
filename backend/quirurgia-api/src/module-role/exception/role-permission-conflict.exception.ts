import { ConflictException } from '@nestjs/common';
import { RolePermissionConflictReasonEnum } from '../enum/role-permission-conflict-reason.enum';

export class RolePermissionConflictException extends ConflictException {
  constructor(reason: RolePermissionConflictReasonEnum) {
    super(`Permission-role relation already exists`);
  }
}
