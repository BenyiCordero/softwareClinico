import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { BRANCH_CONSTRAINT_MAP } from './const/branch.constraint';
import { CreateBranchDto } from './dto/request/create-branch.dto';
import { FindBranchQueryDto } from './dto/request/find-branch-query.dto';
import { UpdateBranchDto } from './dto/request/update-branch.dto';
import { BranchMapper } from './dto/branch.mapper';
import { BranchResponseDto } from './dto/response/branch-response.dto';
import { Branch } from './entity/branch.entity';
import { BranchStatus } from './enum/branch-status.enum';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch) private readonly repository: Repository<Branch>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(
    filters: FindBranchQueryDto = {},
  ): Promise<OffsetPaginatedResult<BranchResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository
      .createQueryBuilder('branch')
      .orderBy('branch.name', 'ASC');
    if (filters.code)
      query.andWhere('branch.code ILIKE :code', { code: `%${filters.code}%` });
    if (filters.name)
      query.andWhere('branch.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status)
      query.andWhere('branch.status = :status', { status: filters.status });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(BranchMapper.toResponseDto),
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

  async findOne(id: number): Promise<BranchResponseDto> {
    return BranchMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreateBranchDto): Promise<BranchResponseDto> {
    await this.ensureCodeAvailable(dto.code);
    try {
      return BranchMapper.toResponseDto(
        await this.repository.save(this.repository.create(dto)),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        BRANCH_CONSTRAINT_MAP,
      );
    }
  }

  async update(id: number, dto: UpdateBranchDto): Promise<BranchResponseDto> {
    const branch = await this.findByIdOrThrow(id);
    if (dto.code && dto.code !== branch.code)
      await this.ensureCodeAvailable(dto.code, id);
    try {
      return BranchMapper.toResponseDto(
        await this.repository.save(this.repository.merge(branch, dto)),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        BRANCH_CONSTRAINT_MAP,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const branch = await this.findByIdOrThrow(id);
    if (branch.status === BranchStatus.INACTIVE) return;
    branch.status = BranchStatus.INACTIVE;
    await this.repository.save(branch);
  }

  async findByIdOrThrow(id: number): Promise<Branch> {
    const branch = await this.repository.findOneBy({ branchId: id });
    if (!branch) throw new NotFoundException(`Branch with id ${id} not found`);
    return branch;
  }

  private async ensureCodeAvailable(
    code: string,
    excludeId?: number,
  ): Promise<void> {
    const query = this.repository
      .createQueryBuilder('branch')
      .where('branch.code = :code', { code });
    if (excludeId)
      query.andWhere('branch.branch_id != :excludeId', { excludeId });
    if (await query.getExists())
      throw new ConflictException(`Branch code ${code} is already in use`);
  }
}
