import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RolePermission } from './entity/role-permission.entity';
import { RoleService } from './role.service';
import { RolePermissionService } from './role-permission.service';
import { PermissionModule } from '../module-permission/permission.module';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { DatabaseModule } from '../common/module/database.module';
import { RoleController } from './role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermission]),
    PermissionModule,
    DatabaseModule,
  ],
  providers: [RoleService, RolePermissionService, DatabaseExceptionMapper],
  controllers: [RoleController],
  exports: [RolePermissionService],
})
export class RoleModule {}
