import { ConflictException } from '@nestjs/common';
import { BranchConflictReasonEnum } from '../enum/branch-conflict-reason.enum';

export class BranchConflictException extends ConflictException {
  constructor(reason: BranchConflictReasonEnum) {
    super(`Branch ${reason} already exists`);
  }
}
