import { ServiceConflictReasonEnum } from '../enum/service-conflict-reason.enum';
import { ServiceConstraintEnum } from '../enum/service-constraint.enum';
import { ServiceConflictException } from '../exception/service-conflict.exception';

export const SERVICE_CONSTRAINT_MAP: Record<ServiceConstraintEnum, () => ServiceConflictException> = {
  [ServiceConstraintEnum.CODE]: () => new ServiceConflictException(ServiceConflictReasonEnum.CODE),
  [ServiceConstraintEnum.REQUIREMENT_NAME]: () => new ServiceConflictException(ServiceConflictReasonEnum.REQUIREMENT_NAME),
  [ServiceConstraintEnum.REQUIREMENT_SORT_ORDER]: () => new ServiceConflictException(ServiceConflictReasonEnum.REQUIREMENT_SORT_ORDER),
};
