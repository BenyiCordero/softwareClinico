import { NotFoundException } from '@nestjs/common';

export class RoleNotFoundException extends NotFoundException {
  constructor(roleId: number) {
    super(`Role with id ${roleId} not found`);
  }
}