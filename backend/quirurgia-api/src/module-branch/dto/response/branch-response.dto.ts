import { BranchStatus } from '../../enum/branch-status.enum';

export class BranchResponseDto {
  branchId: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  timezone: string;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}
