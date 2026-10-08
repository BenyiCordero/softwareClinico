import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entity/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuditLog,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuditLogModule {}
