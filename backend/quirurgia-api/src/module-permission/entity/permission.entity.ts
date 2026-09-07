import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionStatus } from '../enum/permission-status.enum';

@Entity('permission')
export class Permission {
  @PrimaryGeneratedColumn()
  permissionId: number;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'module', type: 'varchar' })
  module: string;

  @Column({ name: 'resource', type: 'varchar' })
  resource: string;

  @Column({ name: 'action', type: 'varchar' })
  action: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PermissionStatus, name: 'status' })
  status: PermissionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
