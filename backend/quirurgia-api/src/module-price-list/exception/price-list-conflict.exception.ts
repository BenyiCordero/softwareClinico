import { ConflictException } from '@nestjs/common';
import { PriceListConflictReasonEnum } from '../enum/price-list-conflict-reason.enum';

export class PriceListConflictException extends ConflictException {
  constructor(reason: PriceListConflictReasonEnum) {
    super(`Price list ${reason} already exists`);
  }
}
