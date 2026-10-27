import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RequirePermissions } from '../common/decorator/require-permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { FindAuditLogQueryDto } from './dto/request/find-audit-log-query.dto';
import { AuditLogService } from './audit-log.service';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AuditLogController {
  constructor(private readonly service: AuditLogService) {}

  @Get()
  @RequirePermissions('audit-logs.read')
  findAll(@Query() query: FindAuditLogQueryDto) {
    return this.service.findAll(query);
  }
}
