import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entity/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Permission,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PermissionModule {}
