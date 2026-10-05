import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { CreatePatientCategoryDto } from './dto/request/create-patient-category.dto';
import { FindPatientCategoryQueryDto } from './dto/request/find-patient-category-query.dto';
import { UpdatePatientCategoryDto } from './dto/request/update-patient-category.dto';
import { PatientCategoryMapper } from './dto/patient-category.mapper';
import { PatientCategoryResponseDto } from './dto/response/patient-category-response.dto';
import { PatientCategory } from './entity/patient-category.entity';

@Injectable()
export class PatientCategoryService {
  constructor(@InjectRepository(PatientCategory) private readonly repository: Repository<PatientCategory>) {}

  async findAll(filters: FindPatientCategoryQueryDto = {}): Promise<OffsetPaginatedResult<PatientCategoryResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository.createQueryBuilder('category').orderBy('category.name', 'ASC');
    if (filters.name) query.andWhere('category.name ILIKE :name', { name: `%${filters.name}%` });
    if (filters.status) query.andWhere('category.status = :status', { status: filters.status });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(PatientCategoryMapper.toResponseDto),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }

  async findOne(id: number): Promise<PatientCategoryResponseDto> {
    return PatientCategoryMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(dto: CreatePatientCategoryDto): Promise<PatientCategoryResponseDto> {
    await this.ensureNameAvailable(dto.name);
    return PatientCategoryMapper.toResponseDto(await this.repository.save(this.repository.create(dto)));
  }

  async update(id: number, dto: UpdatePatientCategoryDto): Promise<PatientCategoryResponseDto> {
    const category = await this.findByIdOrThrow(id);
    if (dto.name && dto.name !== category.name) await this.ensureNameAvailable(dto.name, id);
    return PatientCategoryMapper.toResponseDto(await this.repository.save(this.repository.merge(category, dto)));
  }

  async remove(id: number): Promise<void> {
    await this.findByIdOrThrow(id);
    await this.repository.delete(id);
  }

  private async findByIdOrThrow(id: number): Promise<PatientCategory> {
    const category = await this.repository.findOneBy({ patientCategoryId: id });
    if (!category) throw new NotFoundException(`Patient category with id ${id} not found`);
    return category;
  }

  private async ensureNameAvailable(name: string, excludeId?: number): Promise<void> {
    const query = this.repository.createQueryBuilder('category').where('LOWER(category.name) = LOWER(:name)', { name });
    if (excludeId) query.andWhere('category.patient_category_id != :excludeId', { excludeId });
    if (await query.getExists()) throw new ConflictException(`Patient category name ${name} is already in use`);
  }
}
