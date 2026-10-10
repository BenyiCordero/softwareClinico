import { BadRequestException } from '@nestjs/common';

export class RefreshTokenDue extends BadRequestException {
  constructor() {
    super(`refresh token is due`);
  }
}
