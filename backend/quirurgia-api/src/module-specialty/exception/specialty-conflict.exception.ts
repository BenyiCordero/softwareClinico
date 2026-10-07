import { ConflictException } from '@nestjs/common';
import { SpecialtyConflictReasonEnum } from '../enum/specialty-conflict-reason.enum';

export class SpecialtyConflictException extends ConflictException {
  constructor(reason: SpecialtyConflictReasonEnum) {
    super(`Specialty ${reason} already exists`);
  }
}
