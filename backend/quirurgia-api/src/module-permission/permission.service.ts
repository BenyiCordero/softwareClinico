import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { In, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/request/create-permission.dto';
import { PermissionResponseDto } from './dto/response/permission-response.dto';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PERMISSION_CONSTRAINT_MAP } from './const/permission.const';
import { PermissionMapper } from './dto/mapper/permission.mapper';
import { PermissionResource } from './enum/permission-resource.enum';
import { PermissionAction } from './enum/permission-action.enum';
import { PermissionNotFoundException } from './exception/permission-not-found.exception';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async create(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    try {
      const permission = this.permissionRepository.create(dto);
      permission.code = this.generateCode(
        permission.resource,
        permission.action,
      );
      return PermissionMapper.toResponse(
        await this.permissionRepository.save(permission),
      );
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        PERMISSION_CONSTRAINT_MAP,
      );
    }
  }

  async findPermissionOrThrowById(permissionId: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: {
        permissionId: permissionId,
      },
    });
    if (!permission) throw new PermissionNotFoundException(permissionId);
    return permission;
  }

  async createManyIfNotExists(
    dtos: CreatePermissionDto[],
  ): Promise<PermissionResponseDto[]> {
    const permissions = dtos.map((dto) => ({
      ...dto,
      code: this.generateCode(dto.resource, dto.action),
    }));
    try {
      await this.permissionRepository
        .createQueryBuilder()
        .insert()
        .values(permissions)
        .orIgnore()
        .execute();
      const permissionsSaved = await this.permissionRepository.find({
        where: {
          code: In(permissions.map(({ code }) => code)),
        },
      });
      return permissionsSaved.map(PermissionMapper.toResponse);
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        PERMISSION_CONSTRAINT_MAP,
      );
    }
  }

  generateCode(resource: PermissionResource, action: PermissionAction): string {
    return `${resource.toLowerCase().replaceAll('_', '-')}.${action.toLowerCase()}`;
  }
}
