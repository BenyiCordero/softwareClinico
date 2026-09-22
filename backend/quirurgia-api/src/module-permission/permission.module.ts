import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';
import { PermissionService } from './permission.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
    ]),
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
