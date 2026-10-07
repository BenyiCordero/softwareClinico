import { retry } from "rxjs";
import { PermissionMapper } from "../../../module-permission/dto/mapper/permission.mapper";
import { Role } from "../../entity/role.entity";
import { RoleResponseDto } from "../response/role-response.dto";
import { RoleSummaryResponseDto } from "../response/role-summary-response.dto";

export class RoleMapper {
    static toResponse(role: Role): RoleResponseDto {
        return {
            roleId: role.roleId,
            name: role.name,
            description: role.description,
            status: role.status,
            type: role.type,
            createdAt: role.createdAt,
            permissions: role.rolePermissions.map(({ permission }) =>
                PermissionMapper.toResponse(permission),
            ) ?? [],
        }
    }

    static toSummaryResponse(role: Role): RoleSummaryResponseDto {
        return {
            roleId: role.roleId,
            name: role.name,
            status: role.status,
            type: role.type
        }
    }
}