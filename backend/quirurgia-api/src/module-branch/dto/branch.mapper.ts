import { Branch } from '../entity/branch.entity';
import { BranchResponseDto } from './response/branch-response.dto';

export class BranchMapper {
  static toResponseDto(branch: Branch): BranchResponseDto {
    return {
      branchId: branch.branchId,
      code: branch.code,
      name: branch.name,
      phone: branch.phone,
      email: branch.email,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      postalCode: branch.postalCode,
      timezone: branch.timezone,
      status: branch.status,
      createdAt: branch.createdAt,
      updatedAt: branch.updatedAt,
    };
  }
}
