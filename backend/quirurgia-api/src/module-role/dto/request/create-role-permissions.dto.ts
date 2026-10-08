import { IsInt, IsNotEmpty, Min } from "class-validator";

export class CreateRolePermission {
    @IsInt()
    @IsNotEmpty()
    @Min(1)
    roleId: number

    @IsInt()
    @IsNotEmpty()
    @Min(1)
    permissionId: number;
}