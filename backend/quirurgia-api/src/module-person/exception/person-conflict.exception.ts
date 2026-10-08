import { ConflictException } from '@nestjs/common';
import { PersonConflictReasonEnum } from '../enum/person-conflict-reason.enum';

export class PersonConflictException extends ConflictException {
  constructor(reason: PersonConflictReasonEnum) {
    super(`Person ${reason} already exists`);
  }
}
