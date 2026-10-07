import { ConflictException } from '@nestjs/common';
import { RoleConflictReasonEnum } from '../enum/role-conflict-reason.enum';

export class RoleConflictException extends ConflictException {
  constructor(reason: RoleConflictReasonEnum) {
    super(`Role ${reason} already exists`);
  }
}