import { AssignmentType } from '../../enum/assignment-type.enum';
import { EmployeeAssignmentStatus } from '../../enum/employee-assignment-status.enum';

export class EmployeeAssignmentResponseDto {
  employeeAssignmentId: number;
  branchId: number;
  areaId: number | null;
  positionId: number;
  assignmentType: AssignmentType;
  status: EmployeeAssignmentStatus;
  startDate: string;
  endDate: string | null;
}
