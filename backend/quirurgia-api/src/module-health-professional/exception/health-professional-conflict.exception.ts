import { ConflictException } from '@nestjs/common';
import { HealthProfessionalConflictReasonEnum } from '../enum/health-professional-conflict-reason.enum';

export class HealthProfessionalConflictException extends ConflictException {
  constructor(reason: HealthProfessionalConflictReasonEnum) {
    super(`Health professional ${reason} already exists`);
  }
}
