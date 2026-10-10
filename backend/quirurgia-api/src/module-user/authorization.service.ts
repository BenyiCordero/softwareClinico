import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PermissionStatus } from '../module-permission/enum/permission-status.enum';
import { RoleStatus } from '../module-role/enum/role-status.enum';
import { PermissionEffect } from './enum/permission-effect.enum';
import { PermissionOverrideStatus } from './enum/permission-override-status.enum';
import { UserRoleStatus } from './enum/user-role-status.enum';
import { UserPermissionOverride } from './entity/user-permission-override.entity';
import { UserRole } from './entity/user-role.entity';

/**
 * Resolves the effective permission set of a user for a branch scope:
 * permissions inherited from active roles, union the ALLOW overrides,
 * minus the DENY overrides.
 */
@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPermissionOverride)
    private readonly overrideRepository: Repository<UserPermissionOverride>,
  ) {}

  async getEffectivePermissions(
    userId: number,
    branchId?: number,
  ): Promise<Set<string>> {
    const now = new Date();

    const roleQuery = this.userRoleRepository
      .createQueryBuilder('userRole')
      .innerJoin('userRole.role', 'role')
      .innerJoin('role.rolePermissions', 'rolePermission')
      .innerJoin('rolePermission.permission', 'permission')
      .select('permission.code', 'code')
      .where('userRole.user_id = :userId', { userId })
      .andWhere('userRole.status = :userRoleStatus', {
        userRoleStatus: UserRoleStatus.ACTIVE,
      })
      .andWhere('role.status = :roleStatus', { roleStatus: RoleStatus.ACTIVE })
      .andWhere('permission.status = :permissionStatus', {
        permissionStatus: PermissionStatus.ACTIVE,
      })
      .andWhere(
        '(userRole.valid_from IS NULL OR userRole.valid_from <= :now)',
        { now },
      )
      .andWhere(
        '(userRole.valid_until IS NULL OR userRole.valid_until > :now)',
        { now },
      );
    this.applyBranchScope(roleQuery, 'userRole', branchId);

    const overrideQuery = this.overrideRepository
      .createQueryBuilder('override')
      .innerJoin('override.permission', 'permission')
      .select('permission.code', 'code')
      .addSelect('override.effect', 'effect')
      .where('override.user_id = :userId', { userId })
      .andWhere('override.status = :overrideStatus', {
        overrideStatus: PermissionOverrideStatus.ACTIVE,
      })
      .andWhere('permission.status = :permissionStatus', {
        permissionStatus: PermissionStatus.ACTIVE,
      })
      .andWhere(
        '(override.valid_from IS NULL OR override.valid_from <= :now)',
        { now },
      )
      .andWhere(
        '(override.valid_until IS NULL OR override.valid_until > :now)',
        { now },
      );
    this.applyBranchScope(overrideQuery, 'override', branchId);

    const [roleRows, overrideRows] = await Promise.all([
      roleQuery.getRawMany<{ code: string }>(),
      overrideQuery.getRawMany<{ code: string; effect: PermissionEffect }>(),
    ]);

    const effective = new Set<string>(roleRows.map((row) => row.code));
    const allowed = new Set<string>();
    const denied = new Set<string>();
    for (const row of overrideRows) {
      if (row.effect === PermissionEffect.ALLOW) allowed.add(row.code);
      else denied.add(row.code);
    }
    for (const code of allowed) effective.add(code);
    for (const code of denied) effective.delete(code);
    return effective;
  }

  async hasAllPermissions(
    userId: number,
    permissionCodes: string[],
    branchId?: number,
  ): Promise<boolean> {
    const effective = await this.getEffectivePermissions(userId, branchId);
    return permissionCodes.every((code) => effective.has(code));
  }

  private applyBranchScope(
    query: SelectQueryBuilder<any>,
    alias: string,
    branchId?: number,
  ): void {
    if (branchId) {
      query.andWhere(
        `(${alias}.branch_id IS NULL OR ${alias}.branch_id = :branchId)`,
        { branchId },
      );
    } else {
      query.andWhere(`${alias}.branch_id IS NULL`);
    }
  }
}
