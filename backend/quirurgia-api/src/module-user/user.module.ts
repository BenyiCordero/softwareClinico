import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from '../module-branch/entity/branch.entity';
import { Permission } from '../module-permission/entity/permission.entity';
import { Person } from '../module-person/entity/person.entity';
import { Role } from '../module-role/entity/role.entity';
import { AuthorizationService } from './authorization.service';
import { User } from './entity/user.entity';
import { UserPermissionOverride } from './entity/user-permission-override.entity';
import { UserRole } from './entity/user-role.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    TypeOrmModule.forFeature([User, UserRole, UserPermissionOverride, Person, Role, Branch, Permission]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthorizationService],
  exports: [UserService, AuthorizationService],
})
export class UserModule {}