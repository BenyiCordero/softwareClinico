import { Permission } from '../../entity/permission.entity';
import { PermissionResponseDto } from '../response/permission-response.dto';

export class PermissionMapper {
  static toResponse(permission: Permission): PermissionResponseDto {
    return {
      permissionId: permission.permissionId,
      code: permission.code,
      resource: permission.resource,
      action: permission.action,
      status: permission.status,
      createdAt: permission.createdAt,
      deprecatedAt: permission.deprecatedAt ?? null,
    };
  }
}
