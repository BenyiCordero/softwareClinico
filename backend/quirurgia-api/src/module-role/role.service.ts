import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';
import { CreateRoleDto } from './dto/request/create-role.dto';
import { RoleResponseDto } from './dto/response/role-response.dto';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { ROLE_CONSTRAINT_MAP } from './const/role.constraint';
import { RoleMapper } from './dto/mapper/role.mapper';
import { RoleNotFoundException } from './exception/role-not-found.exception';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly databaseExceptionMapper: DatabaseExceptionMapper,
  ) {}

  async create(dto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = this.roleRepository.create(dto);
      return RoleMapper.toResponse(await this.roleRepository.save(role));
    } catch (error: unknown) {
      throw this.databaseExceptionMapper.fromTypeOrmError(
        error,
        ROLE_CONSTRAINT_MAP,
      );
    }
  }

  async findRoleOrThrowById(roleId: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: {
        roleId: roleId,
      },
    });
    if (!role) throw new RoleNotFoundException(roleId);
    return role;
  }
}
