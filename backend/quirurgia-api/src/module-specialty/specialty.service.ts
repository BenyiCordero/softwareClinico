import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreateSpecialtyDto } from './dto/request/create-specialty.dto';
import { FindSpecialtyQueryDto } from './dto/request/find-specialty-query.dto';
import { UpdateSpecialtyDto } from './dto/request/update-specialty.dto';
import { SpecialtyMapper } from './dto/specialty.mapper';
import { SpecialtyResponseDto } from './dto/response/specialty-response.dto';
import { Specialty } from './entity/specialty.entity';
import { SpecialtyStatus } from './enum/specialty-status.enum';
import { SPECIALTY_CONSTRAINT_MAP } from './const/specialty.constraint';

@Injectable()
export class SpecialtyService {
  constructor(
    @InjectRepository(Specialty) private readonly repository: Repository<Specialty>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(filters: FindSpecialtyQueryDto = {}): Promise<OffsetPaginatedResult<SpecialtyResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository.createQueryBuilder('specialty').orderBy('specialty.name', 'ASC');
    if (filters.name) query.andWhere('specialty.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status) query.andWhere('specialty.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(SpecialtyMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async findOne(id: number): Promise<SpecialtyResponseDto> {
    return SpecialtyMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreateSpecialtyDto): Promise<SpecialtyResponseDto> {
    await this.ensureNameAvailable(dto.name);
    try {
      return SpecialtyMapper.toResponseDto(await this.repository.save(this.repository.create(dto)));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SPECIALTY_CONSTRAINT_MAP);
    }
  }

  async update(id: number, dto: UpdateSpecialtyDto): Promise<SpecialtyResponseDto> {
    const specialty = await this.findByIdOrThrow(id);
    if (dto.name && dto.name !== specialty.name) await this.ensureNameAvailable(dto.name, id);
    try {
      return SpecialtyMapper.toResponseDto(await this.repository.save(this.repository.merge(specialty, dto)));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(error, SPECIALTY_CONSTRAINT_MAP);
    }
  }

  async remove(id: number): Promise<void> {
    const specialty = await this.findByIdOrThrow(id);
    if (specialty.status === SpecialtyStatus.INACTIVE) return;
    specialty.status = SpecialtyStatus.INACTIVE;
    await this.repository.save(specialty);
  }

  private async findByIdOrThrow(id: number): Promise<Specialty> {
    const specialty = await this.repository.findOneBy({ specialtyId: id });
    if (!specialty) throw new NotFoundException(`Specialty with id ${id} not found`);
    return specialty;
  }

  private async ensureNameAvailable(name: string, excludeId?: number): Promise<void> {
    const query = this.repository.createQueryBuilder('specialty').where('LOWER(specialty.name) = LOWER(:name)', { name });
    if (excludeId) query.andWhere('specialty.specialty_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException(`Specialty name ${name} is already in use`);
  }
}
