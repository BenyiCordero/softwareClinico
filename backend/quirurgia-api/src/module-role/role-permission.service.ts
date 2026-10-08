import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolePermission } from "./entity/role-permission.entity";
import { Repository } from "typeorm";
import { DatabaseExceptionMapper } from "../common/database/errors/database-exception.mapper";
import { CreateRolePermission } from "./dto/request/create-role-permissions.dto";
import { RolePermissionResponse } from "./dto/response/role-permission-response.dto";
import { ROLE_PERMISSION_CONSTRAINT_MAP } from "./const/role-permission.constraint";
import { RoleService } from "./role.service";
import { PermissionService } from "../module-permission/permission.service";

@Injectable()
export class RolePermissionService {
    constructor(
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
        private readonly databaseExceptionMapper: DatabaseExceptionMapper,
        private readonly roleService: RoleService,
        private readonly permissionService: PermissionService
    ) {}

    async create(dto: CreateRolePermission): Promise<RolePermissionResponse> {
        const permission = await this.permissionService.findPermissionOrThrowById(dto.permissionId);
        const role = await this.roleService.findRoleOrThrowById(dto.roleId);
        const rolePermission = this.rolePermissionRepository.create({
            role: role,
            permission: permission
        });
        try {
            const rolePermissionSaved = this.rolePermissionRepository.save(rolePermission);
            return rolePermissionSaved;
        } catch (error: unknown) {
            this.databaseExceptionMapper.fromTypeOrmError(error, ROLE_PERMISSION_CONSTRAINT_MAP)
        }
    }

    async createManyIfNotExists(roleId: number, permissionIds: number[]): Promise<void> {
        await this.roleService.findRoleOrThrowById(roleId);

        await this.rolePermissionRepository
            .createQueryBuilder()
            .insert()
            .into(RolePermission)
            .values(
                permissionIds.map((permissionId) => ({
                    role: { roleId },
                    permission: { permissionId },
                })),
            )
            .orIgnore()
            .execute();
    }
}
