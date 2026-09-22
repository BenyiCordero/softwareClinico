import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RolePermission } from './entity/role-permission.entity';
import { RoleService } from './role.service';
import { RolePermissionService } from './role-permission.service';
import { PermissionModule } from '../module-permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      RolePermission,
    ]),
    PermissionModule
  ],
  providers: [
    RoleService,
    RolePermissionService
  ],
  controllers: [],
  exports: [
    RolePermissionService
  ],
})
export class RoleModule {}
