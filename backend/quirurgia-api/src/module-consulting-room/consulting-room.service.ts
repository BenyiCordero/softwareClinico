import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { Area } from '../module-area/entity/area.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { CONSULTING_ROOM_CONSTRAINT_MAP } from './const/consulting-room.constraint';
import { CreateConsultingRoomDto } from './dto/request/create-consulting-room.dto';
import { FindConsultingRoomQueryDto } from './dto/request/find-consulting-room-query.dto';
import { UpdateConsultingRoomDto } from './dto/request/update-consulting-room.dto';
import { ConsultingRoomMapper } from './dto/consulting-room.mapper';
import { ConsultingRoomResponseDto } from './dto/response/consulting-room-response.dto';
import { ConsultingRoom } from './entity/consulting-room.entity';
import { ConsultingRoomStatus } from './enum/consulting-room-status.enum';

@Injectable()
export class ConsultingRoomService {
  constructor(
    @InjectRepository(ConsultingRoom)
    private readonly repository: Repository<ConsultingRoom>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(
    filters: FindConsultingRoomQueryDto = {},
  ): Promise<OffsetPaginatedResult<ConsultingRoomResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.baseQuery().orderBy('room.name', 'ASC');
    if (filters.branchId)
      query.andWhere('branch.branch_id = :branchId', {
        branchId: filters.branchId,
      });
    if (filters.areaId)
      query.andWhere('area.area_id = :areaId', { areaId: filters.areaId });
    if (filters.code)
      query.andWhere('room.code ILIKE :code', { code: `%${filters.code}%` });
    if (filters.name)
      query.andWhere('room.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status)
      query.andWhere('room.status = :status', { status: filters.status });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(ConsultingRoomMapper.toResponseDto),
      pagination: {
        type: PaginationEnum.OFFSET,
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<ConsultingRoomResponseDto> {
    return ConsultingRoomMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(
    dto: CreateConsultingRoomDto,
  ): Promise<ConsultingRoomResponseDto> {
    const branch = await this.findBranchOrThrow(dto.branchId);
    const area = dto.areaId ? await this.findAreaOrThrow(dto.areaId) : null;
    this.ensureAreaBelongsToBranch(area, branch.branchId);
    await this.ensureCodeAvailable(dto.code, branch.branchId);
    try {
      return ConsultingRoomMapper.toResponseDto(
        await this.repository.save(
          this.repository.create({
            branch,
            area,
            code: dto.code,
            name: dto.name,
            floor: dto.floor ?? null,
            description: dto.description,
          }),
        ),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        CONSULTING_ROOM_CONSTRAINT_MAP,
      );
    }
  }

  async update(
    id: number,
    dto: UpdateConsultingRoomDto,
  ): Promise<ConsultingRoomResponseDto> {
    const room = await this.findByIdOrThrow(id);
    const branch =
      dto.branchId === undefined
        ? room.branch
        : await this.findBranchOrThrow(dto.branchId);
    const area =
      dto.areaId === undefined
        ? room.area
        : dto.areaId === null
          ? null
          : await this.findAreaOrThrow(dto.areaId);
    this.ensureAreaBelongsToBranch(area, branch.branchId);
    const code = dto.code ?? room.code;
    if (code !== room.code || branch.branchId !== room.branch.branchId) {
      await this.ensureCodeAvailable(code, branch.branchId, id);
    }
    room.branch = branch;
    room.area = area;
    if (dto.code !== undefined) room.code = dto.code;
    if (dto.name !== undefined) room.name = dto.name;
    if (dto.floor !== undefined) room.floor = dto.floor;
    if (dto.description !== undefined) room.description = dto.description;
    if (dto.status !== undefined) room.status = dto.status;
    try {
      return ConsultingRoomMapper.toResponseDto(
        await this.repository.save(room),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        CONSULTING_ROOM_CONSTRAINT_MAP,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const room = await this.findByIdOrThrow(id);
    if (room.status === ConsultingRoomStatus.INACTIVE) return;
    room.status = ConsultingRoomStatus.INACTIVE;
    await this.repository.save(room);
  }

  private async findByIdOrThrow(id: number): Promise<ConsultingRoom> {
    const room = await this.baseQuery()
      .where('room.consultingRoomId = :id', { id })
      .getOne();
    if (!room)
      throw new NotFoundException(`Consulting room with id ${id} not found`);
    return room;
  }

  private baseQuery() {
    return this.repository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.branch', 'branch')
      .leftJoinAndSelect('room.area', 'area');
  }

  private async findBranchOrThrow(id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOneBy({ branchId: id });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  private async findAreaOrThrow(id: number): Promise<Area> {
    const area = await this.areaRepository.findOne({
      where: { areaId: id },
      relations: { branch: true },
    });
    if (!area) throw new NotFoundException(`Area with id ${id} not found`);
    return area;
  }

  private ensureAreaBelongsToBranch(area: Area | null, branchId: number): void {
    if (area && area.branch.branchId !== branchId) {
      throw new BadRequestException(
        'The consulting room area must belong to the same branch',
      );
    }
  }

  private async ensureCodeAvailable(
    code: string,
    branchId: number,
    excludeId?: number,
  ): Promise<void> {
    const query = this.repository
      .createQueryBuilder('room')
      .where('room.branch_id = :branchId', { branchId })
      .andWhere('room.code = :code', { code });
    if (excludeId)
      query.andWhere('room.consulting_room_id != :excludeId', { excludeId });
    if (await query.getExists())
      throw new ConflictException(
        `Consulting room code ${code} is already in use in this branch`,
      );
  }
}
