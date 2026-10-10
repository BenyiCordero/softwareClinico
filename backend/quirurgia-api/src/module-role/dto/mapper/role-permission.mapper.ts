import { PermissionMapper } from '../../../module-permission/dto/mapper/permission.mapper';
import { RolePermission } from '../../entity/role-permission.entity';
import { RolePermissionResponse } from '../response/role-permission-response.dto';
import { RoleMapper } from './role.mapper';

export class RolePermissionMapper {
  static toResponse(rolePermission: RolePermission): RolePermissionResponse {
    return {
      rolePermissionId: rolePermission.rolePermissionId,
      permission: PermissionMapper.toResponse(rolePermission.permission),
      role: RoleMapper.toSummaryResponse(rolePermission.role),
    };
  }
}
