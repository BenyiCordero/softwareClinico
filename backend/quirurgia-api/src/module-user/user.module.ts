import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRole } from './entity/user-role.entity';
import { UserPermissionOverride } from './entity/user-permission-override.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserRole,
      UserPermissionOverride,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class UserModule {}
