import { HealthProfessionalConflictReasonEnum } from '../enum/health-professional-conflict-reason.enum';
import { HealthProfessionalConstraintEnum } from '../enum/health-professional-constraint.enum';
import { HealthProfessionalConflictException } from '../exception/health-professional-conflict.exception';

export const HEALTH_PROFESSIONAL_CONSTRAINT_MAP: Record<
  HealthProfessionalConstraintEnum,
  () => HealthProfessionalConflictException
> = {
  [HealthProfessionalConstraintEnum.EMPLOYEE]: () =>
    new HealthProfessionalConflictException(HealthProfessionalConflictReasonEnum.EMPLOYEE),
  [HealthProfessionalConstraintEnum.LICENSE]: () =>
    new HealthProfessionalConflictException(HealthProfessionalConflictReasonEnum.LICENSE),
  [HealthProfessionalConstraintEnum.SPECIALTY_PAIR]: () =>
    new HealthProfessionalConflictException(HealthProfessionalConflictReasonEnum.SPECIALTY_PAIR),
  [HealthProfessionalConstraintEnum.PRIMARY_SPECIALTY]: () =>
    new HealthProfessionalConflictException(HealthProfessionalConflictReasonEnum.PRIMARY_SPECIALTY),
};
