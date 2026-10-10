import { ServiceAssignment } from '../entity/service-assignment.entity';
import { ServiceRequirement } from '../entity/service-requirement.entity';
import { Service } from '../entity/service.entity';
import { ServiceAssignmentResponseDto } from './response/service-assignment-response.dto';
import { ServiceRequirementResponseDto } from './response/service-requirement-response.dto';
import { ServiceResponseDto } from './response/service-response.dto';

export class ServiceMapper {
  static toResponseDto(service: Service): ServiceResponseDto {
    return {
      serviceId: service.serviceId,
      categoryId: service.category.serviceCategoryId,
      code: service.code,
      name: service.name,
      description: service.description,
      durationMinutes: service.durationMinutes,
      schedulingType: service.schedulingType,
      status: service.status,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    };
  }

  static toRequirementResponseDto(
    requirement: ServiceRequirement,
  ): ServiceRequirementResponseDto {
    return {
      serviceRequirementId: requirement.serviceRequirementId,
      serviceId: requirement.service.serviceId,
      name: requirement.name,
      description: requirement.description,
      requirementLevel: requirement.requirementLevel,
      sortOrder: requirement.sortOrder,
      status: requirement.status,
    };
  }

  static toAssignmentResponseDto(
    assignment: ServiceAssignment,
  ): ServiceAssignmentResponseDto {
    return {
      serviceAssignmentId: assignment.serviceAssignmentId,
      serviceId: assignment.service.serviceId,
      branchId: assignment.branch.branchId,
      areaId: assignment.area?.areaId ?? null,
      consultingRoomId: assignment.consultingRoom?.consultingRoomId ?? null,
      healthProfessionalId:
        assignment.healthProfessional?.healthProfessionalId ?? null,
      status: assignment.status,
      createdAt: assignment.createdAt,
    };
  }
}
