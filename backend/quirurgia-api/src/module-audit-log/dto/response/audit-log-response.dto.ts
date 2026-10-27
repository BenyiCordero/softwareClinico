export class AuditLogResponseDto {
  auditLogId: number;
  action: string;
  resource: string;
  resourceId: number | null;
  userId: number | null;
  createdAt: Date;
  metadata: Record<string, unknown> | null;
}
