import { ConflictException } from '@nestjs/common';
import { PositionConflictReasonEnum } from '../enum/position-conflict-reason.enum';

export class PositionConflictException extends ConflictException {
  constructor(reason: PositionConflictReasonEnum) {
    super(`Position ${reason} already exists`);
  }
}
