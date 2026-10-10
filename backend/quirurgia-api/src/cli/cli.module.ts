import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigModule } from '../common/module/config.module';
import { DatabaseModule } from '../common/module/database.module';
import { LoggerConfigModule } from '../common/module/logger.module';
import { UserModule } from '../module-user/user.module';
import { PermissionModule } from '../module-permission/permission.module';
import { RoleModule } from '../module-role/role.module';
import { Person } from '../module-person/entity/person.entity';
import { Role } from '../module-role/entity/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([Role, Person]),
    AppConfigModule,
    LoggerConfigModule,
    DatabaseModule,
    UserModule,
    PermissionModule,
    RoleModule,
  ],
})
export class CliModule {}
