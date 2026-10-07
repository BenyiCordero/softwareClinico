import { User } from "../../entity/user.entity";
import { UserResponseDto, UserRoleAssignmentDto } from "../response/user-response.dto";

export class UserMapper {
    static toResponseDto(user: User): UserResponseDto {
        return {
            userId: user.userId,
            username: user.username,
            email: user.email,
            status: user.status,
            personId: user.person?.personId ?? null,
            firstName: user.person?.firstName ?? null,
            middleName: user.person?.middleName ?? null,
            lastName: user.person?.lastName ?? null,
            secondLastName: user.person?.secondLastName ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            roles: (user.userRoles ?? []).map((userRole): UserRoleAssignmentDto => ({
                userRoleId: userRole.userRoleId,
                roleId: userRole.role.roleId,
                roleName: userRole.role.name,
                branchId: userRole.branch ? userRole.branch.branchId : null,
                status: userRole.status,
                validFrom: userRole.validFrom,
                validUntil: userRole.validUntil,
            })),
        };
    }
}