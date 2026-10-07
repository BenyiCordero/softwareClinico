import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '../common/module/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
    ]),
    DatabaseModule
  ],
  providers: [
    PermissionService
  ],
  controllers: [],
  exports: [
    PermissionService
  ],
})
export class PermissionModule {}
