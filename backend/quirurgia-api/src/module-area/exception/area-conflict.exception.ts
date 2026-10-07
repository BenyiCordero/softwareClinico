import { ConflictException } from '@nestjs/common';
import { AreaConflictReasonEnum } from '../enum/area-conflict-reason.enum';

export class AreaConflictException extends ConflictException {
  constructor(reason: AreaConflictReasonEnum) {
    super(`Area ${reason} already exists`);
  }
}
