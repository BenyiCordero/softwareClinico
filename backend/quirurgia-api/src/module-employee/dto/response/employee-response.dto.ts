import { EmployeeStatus } from '../../enum/employee-status.enum';

export class EmployeeResponseDto {
  employeeId: number;
  personId: number;
  employeeNumber: string;
  hireDate: string;
  terminationDate: string | null;
  status: EmployeeStatus;
  createdAt: Date;
  updatedAt: Date;
}
