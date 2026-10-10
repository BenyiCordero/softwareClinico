import { PermissionResponseDto } from '../../../module-permission/dto/response/permission-response.dto';
import { RoleSummaryResponseDto } from './role-summary-response.dto';

export class RolePermissionResponse {
  rolePermissionId: number;
  role: RoleSummaryResponseDto;
  permission: PermissionResponseDto;
}
