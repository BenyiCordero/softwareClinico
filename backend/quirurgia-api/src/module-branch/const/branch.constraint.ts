import { BranchConstraintEnum } from '../enum/branch-constraint.enum';
import { BranchConflictReasonEnum } from '../enum/branch-conflict-reason.enum';
import { BranchConflictException } from '../exception/branch-conflict.exception';

export const BRANCH_CONSTRAINT_MAP: Record<BranchConstraintEnum, () => BranchConflictException> = {
  [BranchConstraintEnum.CODE]: () => new BranchConflictException(BranchConflictReasonEnum.CODE),
};
