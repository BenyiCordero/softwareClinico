import { EmployeeConflictReasonEnum } from '../enum/employee-conflict-reason.enum';
import { EmployeeConstraintEnum } from '../enum/employee-constraint.enum';
import { EmployeeConflictException } from '../exception/employee-conflict.exception';

export const EMPLOYEE_CONSTRAINT_MAP: Record<
  EmployeeConstraintEnum,
  () => EmployeeConflictException
> = {
  [EmployeeConstraintEnum.PERSON]: () =>
    new EmployeeConflictException(EmployeeConflictReasonEnum.PERSON),
  [EmployeeConstraintEnum.NUMBER]: () =>
    new EmployeeConflictException(EmployeeConflictReasonEnum.NUMBER),
  [EmployeeConstraintEnum.PRIMARY_ASSIGNMENT]: () =>
    new EmployeeConflictException(
      EmployeeConflictReasonEnum.PRIMARY_ASSIGNMENT,
    ),
};
