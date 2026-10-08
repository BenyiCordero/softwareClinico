import { RoleStatus } from "../../enum/role-status.enum";
import { RoleType } from "../../enum/role-type.enum";

export class RoleSummaryResponseDto {
    roleId: number;
    name: string;
    type: RoleType;
    status: RoleStatus;
}