import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';
import { DatabaseModule } from '../common/module/database.module';
import { DatabaseExceptionMapper } from '../common/database/errors/database-exception.mapper';
import { PermissionController } from './permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), DatabaseModule],
  providers: [PermissionService, DatabaseExceptionMapper],
  controllers: [PermissionController],
  exports: [PermissionService],
})
export class PermissionModule {}
