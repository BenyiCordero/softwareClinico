import { PriceListConflictReasonEnum } from '../enum/price-list-conflict-reason.enum';
import { PriceListConstraintEnum } from '../enum/price-list-constraint.enum';
import { PriceListConflictException } from '../exception/price-list-conflict.exception';

export const PRICE_LIST_CONSTRAINT_MAP: Record<PriceListConstraintEnum, () => PriceListConflictException> = {
  [PriceListConstraintEnum.DETAIL_SERVICE]: () => new PriceListConflictException(PriceListConflictReasonEnum.DETAIL_SERVICE),
};
