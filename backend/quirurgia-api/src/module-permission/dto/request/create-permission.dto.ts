import { IsEnum, IsNotEmpty, isString, IsString } from "class-validator";
import { PermissionAction } from "../../enum/permission-action.enum";
import { PermissionResource } from "../../enum/permission-resource.enum";

export class CreatePermissionDto {
    @IsEnum(PermissionResource)
    @IsNotEmpty()
    resource: PermissionResource;

    @IsEnum(PermissionAction)
    @IsNotEmpty()
    action: PermissionAction;

    @IsString()
    @IsNotEmpty()
    description: string;
}