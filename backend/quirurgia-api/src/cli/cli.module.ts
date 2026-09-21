import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppConfigModule } from '../common/module/config.module';
import { DatabaseModule } from '../common/module/database.module';
import { LoggerConfigModule } from '../common/module/logger.module';
import { UserModule } from '../module-user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AppConfigModule,
    LoggerConfigModule,
    DatabaseModule,
    UserModule,
  ],
})
export class CliModule {}