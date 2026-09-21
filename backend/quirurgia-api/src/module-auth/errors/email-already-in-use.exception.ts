import { ConflictException } from '@nestjs/common';

export class EmailAlreadyInUseException extends ConflictException {
  constructor(email: string) {
    super(`email ${email} already in use`);
  }
}