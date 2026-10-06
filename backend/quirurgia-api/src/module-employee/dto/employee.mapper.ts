import { EmployeeAssignment } from '../entity/employee-assignment.entity';
import { Employee } from '../entity/employee.entity';
import { EmployeeAssignmentResponseDto } from './response/employee-assignment-response.dto';
import { EmployeeResponseDto } from './response/employee-response.dto';

export class EmployeeMapper {
  static toResponseDto(employee: Employee): EmployeeResponseDto {
    return {
      employeeId: employee.employeeId,
      personId: employee.person.personId,
      employeeNumber: employee.employeeNumber,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  static toAssignmentResponseDto(assignment: EmployeeAssignment): EmployeeAssignmentResponseDto {
    return {
      employeeAssignmentId: assignment.employeeAssignmentId,
      branchId: assignment.branch.branchId,
      areaId: assignment.area?.areaId ?? null,
      positionId: assignment.position.positionId,
      assignmentType: assignment.assignmentType,
      status: assignment.status,
      startDate: assignment.startDate,
      endDate: assignment.endDate,
    };
  }
}
