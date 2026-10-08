import { UnauthorizedException } from '@nestjs/common';

export class UserAccountDisabled extends UnauthorizedException {
  constructor() {
    super(`User account is disabled`);
  }
}