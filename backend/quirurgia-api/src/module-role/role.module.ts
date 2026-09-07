import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { RolePermission } from './entity/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      RolePermission,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class RoleModule {}
