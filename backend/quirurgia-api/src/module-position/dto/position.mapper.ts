import { Position } from '../entity/position.entity';
import { PositionResponseDto } from './response/position-response.dto';

export class PositionMapper {
  static toResponseDto(position: Position): PositionResponseDto {
    return {
      positionId: position.positionId,
      name: position.name,
      description: position.description,
      status: position.status,
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }
}
