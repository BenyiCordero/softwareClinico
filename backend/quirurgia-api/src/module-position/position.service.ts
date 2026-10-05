import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePositionDto } from './dto/request/create-position.dto';
import { FindPositionQueryDto } from './dto/request/find-position-query.dto';
import { UpdatePositionDto } from './dto/request/update-position.dto';
import { PositionMapper } from './dto/position.mapper';
import { PositionResponseDto } from './dto/response/position-response.dto';
import { Position } from './entity/position.entity';

@Injectable()
export class PositionService {
  constructor(@InjectRepository(Position) private readonly repository: Repository<Position>) {}

  async findAll(filters: FindPositionQueryDto = {}): Promise<OffsetPaginatedResult<PositionResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository.createQueryBuilder('position').orderBy('position.name', 'ASC');
    if (filters.name) query.andWhere('position.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status) query.andWhere('position.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    return this.paginate(entities, page, limit, totalItems);
  }

  async findOne(id: number): Promise<PositionResponseDto> {
    return PositionMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreatePositionDto): Promise<PositionResponseDto> {
    await this.ensureNameAvailable(dto.name);
    return PositionMapper.toResponseDto(await this.repository.save(this.repository.create(dto)));
  }

  async update(id: number, dto: UpdatePositionDto): Promise<PositionResponseDto> {
    const position = await this.findByIdOrThrow(id);
    if (dto.name && dto.name !== position.name) await this.ensureNameAvailable(dto.name, id);
    return PositionMapper.toResponseDto(await this.repository.save(this.repository.merge(position, dto)));
  }

  async remove(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.repository.delete(id);
  }

  private async findByIdOrThrow(id: number): Promise<Position> {
    const position = await this.repository.findOneBy({ positionId: id });
    if (!position) throw new NotFoundException(`Position with id ${id} not found`);
    return position;
  }

  private async ensureNameAvailable(name: string, excludeId?: number): Promise<void> {
    const query = this.repository.createQueryBuilder('position').where('LOWER(position.name) = LOWER(:name)', { name });
    if (excludeId) query.andWhere('position.position_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException(`Position name ${name} is already in use`);
  }

  private paginate(entities: Position[], page: number, limit: number, totalItems: number): OffsetPaginatedResult<PositionResponseDto> {
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(PositionMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }
}
