import { NotFoundException } from '@nestjs/common';

export class PermissionNotFoundException extends NotFoundException {
  constructor(permissionId: number) {
    super(`Permission with id ${permissionId} not found`);
  }
}
