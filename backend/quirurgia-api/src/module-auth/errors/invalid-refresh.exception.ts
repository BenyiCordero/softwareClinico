import { UnauthorizedException } from '@nestjs/common';

export class InvalidRefresh extends UnauthorizedException {
  constructor() {
    super(`Invalid refresh token`);
  }
}