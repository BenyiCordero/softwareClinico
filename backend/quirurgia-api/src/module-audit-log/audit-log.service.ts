import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationEnum } from '../common/pagination/enum/pagination.enum';
import { OffsetPaginatedResult } from '../common/pagination/interface/offset-paginated-result.interface';
import { AuditLog } from './entity/audit-log.entity';
import { FindAuditLogQueryDto } from './dto/request/find-audit-log-query.dto';
import { AuditLogResponseDto } from './dto/response/audit-log-response.dto';

@Injectable()
export class AuditLogService {
  constructor(@InjectRepository(AuditLog) private readonly repository: Repository<AuditLog>) {}

  async findAll(filters: FindAuditLogQueryDto = {}): Promise<OffsetPaginatedResult<AuditLogResponseDto>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 25;
    const query = this.repository.createQueryBuilder('auditLog').leftJoinAndSelect('auditLog.user', 'user').orderBy('auditLog.occurredAt', 'DESC');
    if (filters.action) query.andWhere('auditLog.action = :action', { action: filters.action });
    if (filters.module) query.andWhere('auditLog.module = :module', { module: filters.module });
    if (filters.entityType) query.andWhere('auditLog.entityType = :entityType', { entityType: filters.entityType });
    if (filters.entityId) query.andWhere('auditLog.entityId = :entityId', { entityId: filters.entityId });
    if (filters.userId) query.andWhere('user.userId = :userId', { userId: filters.userId });
    if (filters.from) query.andWhere('auditLog.occurredAt >= :from', { from: filters.from });
    if (filters.to) query.andWhere('auditLog.occurredAt <= :to', { to: filters.to });
    const [entities, totalItems] = await query.skip((page - 1) * limit).take(limit).getManyAndCount();
    const totalPages = Math.ceil(totalItems / limit);
    return {
      data: entities.map((entity) => ({
        auditLogId: entity.auditLogId,
        action: entity.action,
        resource: entity.module,
        resourceId: entity.entityId,
        userId: entity.user?.userId ?? null,
        createdAt: entity.occurredAt,
        metadata: entity.newValues,
      })),
      pagination: { type: PaginationEnum.OFFSET, page, limit, totalItems, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 },
    };
  }
}
