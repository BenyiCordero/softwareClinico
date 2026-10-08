import { ConflictException } from '@nestjs/common';
import { ServiceConflictReasonEnum } from '../enum/service-conflict-reason.enum';

export class ServiceConflictException extends ConflictException {
  constructor(reason: ServiceConflictReasonEnum) {
    super(`Service ${reason} already exists`);
  }
}
