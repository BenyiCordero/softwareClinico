import { PermissionAction } from '../../enum/permission-action.enum';
import { PermissionResource } from '../../enum/permission-resource.enum';
import { PermissionStatus } from '../../enum/permission-status.enum';

export class PermissionResponseDto {
  permissionId: number;
  code: string;
  resource: PermissionResource;
  action: PermissionAction;
  status: PermissionStatus;
  createdAt: Date;
  deprecatedAt: Date | null;
}
