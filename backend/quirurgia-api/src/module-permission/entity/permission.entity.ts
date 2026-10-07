import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionStatus } from '../enum/permission-status.enum';
import { PermissionResource } from '../enum/permission-resource.enum';
import { PermissionAction } from '../enum/permission-action.enum';

@Entity('permission')
@Index('UQ_resource_action', ['resource', 'action'], { unique: true })
export class Permission {
  @PrimaryGeneratedColumn()
  permissionId: number;

  @Column({ name: 'code', type: 'varchar' })
  @Index('UQ_permission_code', { unique: true })
  code: string;

  @Column({ name: 'resource', type: 'enum', enum: PermissionResource })
  resource: PermissionResource;

  @Column({ name: 'action', type: 'enum', enum: PermissionAction })
  action: PermissionAction;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PermissionStatus, name: 'status', default: PermissionStatus.ACTIVE })
  status: PermissionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @Column({ name: 'deprecated_at', type: 'timestamptz', nullable: true })
  deprecatedAt: Date | null;
}
