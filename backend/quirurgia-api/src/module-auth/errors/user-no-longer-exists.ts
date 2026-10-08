import { UnauthorizedException } from '@nestjs/common';

export class UserNoLongerExistsException extends UnauthorizedException {
  constructor() {
    super(`User no longer exists`);
  }
}