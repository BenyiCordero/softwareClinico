import { ConflictException } from '@nestjs/common';
import { PermissionConflictReasonEnum } from '../enum/permission-conflict-reason.enum';

export class PermissionConflictException extends ConflictException {
  constructor(reason: PermissionConflictReasonEnum) {
    super(`Permission ${reason} already exists`);
  }
}