import { ConflictException } from '@nestjs/common';
import { EmployeeConflictReasonEnum } from '../enum/employee-conflict-reason.enum';

export class EmployeeConflictException extends ConflictException {
  constructor(reason: EmployeeConflictReasonEnum) {
    super(`Employee ${reason} already exists`);
  }
}
