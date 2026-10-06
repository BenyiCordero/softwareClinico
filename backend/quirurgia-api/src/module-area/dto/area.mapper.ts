import { Area } from '../entity/area.entity';
import { AreaResponseDto } from './response/area-response.dto';

export class AreaMapper {
  static toResponseDto(area: Area): AreaResponseDto {
    return {
      areaId: area.areaId,
      branchId: area.branch.branchId,
      parentAreaId: area.parentArea?.areaId ?? null,
      name: area.name,
      description: area.description,
      status: area.status,
      createdAt: area.createdAt,
      updatedAt: area.updatedAt,
    };
  }
}
