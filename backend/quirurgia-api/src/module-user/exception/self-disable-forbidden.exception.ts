import { ForbiddenException } from '@nestjs/common';

export class SelfDisableForbiddenException extends ForbiddenException {
  constructor() {
    super('You cannot change your own account status');
  }
}
