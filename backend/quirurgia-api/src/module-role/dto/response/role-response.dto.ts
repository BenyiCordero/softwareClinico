import { PermissionResponseDto } from "../../../module-permission/dto/response/permission-response.dto";
import { RoleStatus } from "../../enum/role-status.enum";
import { RoleType } from "../../enum/role-type.enum";

export class RoleResponseDto {
    roleId: number;
    name: string;
    description: string;
    type: RoleType;
    status: RoleStatus;
    createdAt: Date;
    permissions: PermissionResponseDto[];
}