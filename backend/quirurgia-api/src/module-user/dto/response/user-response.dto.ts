import { UserStatus } from '../../enum/user-status.enum';
import { UserRoleStatus } from '../../enum/user-role-status.enum';

export interface UserRoleAssignmentDto {
  userRoleId: number;
  roleId: number;
  roleName: string;
  branchId: number | null;
  status: UserRoleStatus;
  validFrom: Date | null;
  validUntil: Date | null;
}

export interface UserResponseDto {
  userId: number;
  username: string;
  email: string;
  status: UserStatus;
  personId: number | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  secondLastName: string | null;
  createdAt: Date;
  updatedAt: Date;
  roles: UserRoleAssignmentDto[];
}
