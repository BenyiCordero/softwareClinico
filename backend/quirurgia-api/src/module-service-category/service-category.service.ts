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
import { CreateServiceCategoryDto } from './dto/request/create-service-category.dto';
import { FindServiceCategoryQueryDto } from './dto/request/find-service-category-query.dto';
import { UpdateServiceCategoryDto } from './dto/request/update-service-category.dto';
import { ServiceCategoryMapper } from './dto/service-category.mapper';
import { ServiceCategoryResponseDto } from './dto/response/service-category-response.dto';
import { ServiceCategory } from './entity/service-category.entity';
import { ServiceCategoryStatus } from './enum/service-category-status.enum';
import { SERVICE_CATEGORY_CONSTRAINT_MAP } from './const/service-category.constraint';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly repository: Repository<ServiceCategory>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async findAll(
    filters: FindServiceCategoryQueryDto = {},
  ): Promise<OffsetPaginatedResult<ServiceCategoryResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 100;
    const query = this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parentCategory', 'parentCategory')
      .orderBy('category.name', 'ASC');
    if (filters.name)
      query.andWhere('category.name ILIKE :name', {
        name: `%${filters.name}%`,
      });
    if (filters.parentCategoryId)
      query.andWhere('parentCategory.service_category_id = :parentCategoryId', {
        parentCategoryId: filters.parentCategoryId,
      });
    if (filters.status)
      query.andWhere('category.status = :status', { status: filters.status });
    const [entities, totalItems] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map(ServiceCategoryMapper.toResponseDto),
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

  async findOne(id: number): Promise<ServiceCategoryResponseDto> {
    return ServiceCategoryMapper.toResponseDto(await this.findByIdOrThrow(id));
  }

  async create(
    dto: CreateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    const parent = dto.parentCategoryId
      ? await this.findByIdOrThrow(dto.parentCategoryId)
      : null;
    await this.ensureNameAvailable(dto.name, parent?.serviceCategoryId ?? null);
    const category = this.repository.create({
      name: dto.name,
      description: dto.description,
      parentCategory: parent,
    });
    try {
      return ServiceCategoryMapper.toResponseDto(
        await this.repository.save(category),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        SERVICE_CATEGORY_CONSTRAINT_MAP,
      );
    }
  }

  async update(
    id: number,
    dto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategoryResponseDto> {
    const category = await this.findByIdOrThrow(id);
    const parent =
      dto.parentCategoryId === undefined
        ? category.parentCategory
        : dto.parentCategoryId === null
          ? null
          : await this.findByIdOrThrow(dto.parentCategoryId);
    if (parent?.serviceCategoryId === id)
      throw new BadRequestException('A category cannot be its own parent');
    if (parent && (await this.isDescendant(parent.serviceCategoryId, id))) {
      throw new BadRequestException(
        'A category cannot be moved below one of its descendants',
      );
    }
    const name = dto.name ?? category.name;
    const previousParentId = category.parentCategory?.serviceCategoryId ?? null;
    const parentId = parent?.serviceCategoryId ?? null;
    if (name !== category.name || parentId !== previousParentId)
      await this.ensureNameAvailable(name, parentId, id);
    category.parentCategory = parent;
    if (dto.name !== undefined) category.name = dto.name;
    if (dto.description !== undefined) category.description = dto.description;
    if (dto.status !== undefined) category.status = dto.status;
    try {
      return ServiceCategoryMapper.toResponseDto(
        await this.repository.save(category),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        SERVICE_CATEGORY_CONSTRAINT_MAP,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const category = await this.findByIdOrThrow(id);
    if (category.status === ServiceCategoryStatus.INACTIVE) return;
    category.status = ServiceCategoryStatus.INACTIVE;
    await this.repository.save(category);
  }

  private async findByIdOrThrow(id: number): Promise<ServiceCategory> {
    const category = await this.repository.findOne({
      where: { serviceCategoryId: id },
      relations: { parentCategory: true },
    });
    if (!category)
      throw new NotFoundException(`Service category with id ${id} not found`);
    return category;
  }

  private async ensureNameAvailable(
    name: string,
    parentCategoryId: number | null,
    excludeId?: number,
  ): Promise<void> {
    const query = this.repository
      .createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name });
    if (parentCategoryId === null)
      query.andWhere('category.parent_category_id IS NULL');
    else
      query.andWhere('category.parent_category_id = :parentCategoryId', {
        parentCategoryId,
      });
    if (excludeId)
      query.andWhere('category.service_category_id != :excludeId', {
        excludeId,
      });
    if (await query.getExists())
      throw new ConflictException(
        `Service category name ${name} is already in use at this level`,
      );
  }

  private async isDescendant(
    candidateId: number,
    ancestorId: number,
  ): Promise<boolean> {
    let currentId: number | null = candidateId;
    while (currentId !== null) {
      if (currentId === ancestorId) return true;
      const category = await this.repository.findOne({
        where: { serviceCategoryId: currentId },
        relations: { parentCategory: true },
      });
      currentId = category?.parentCategory?.serviceCategoryId ?? null;
    }
    return false;
  }
}
