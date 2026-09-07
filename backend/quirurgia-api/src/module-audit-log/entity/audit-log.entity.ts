import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../module-user/entity/user.entity';

@Entity('audit_log')
export class AuditLog {
  @PrimaryGeneratedColumn()
  auditLogId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User> | null;

  @Column({ name: 'action', type: 'varchar' })
  action: string;

  @Column({ name: 'module', type: 'varchar' })
  module: string;

  @Column({ name: 'entity_type', type: 'varchar' })
  entityType: string;

  @Column({ name: 'entity_id', type: 'integer', nullable: true })
  entityId: number | null;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: Record<string, unknown> | null;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: Record<string, unknown> | null;

  @Column({ name: 'occurred_at', type: 'timestamptz' })
  occurredAt: Date;
}
