import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { RoleStatus } from '../enum/role-status.enum';
import { RoleType } from '../enum/role-type.enum';
import { RolePermission } from './role-permission.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ name: 'name', type: 'varchar' })
  @Index('UQ_role_name', { unique: true })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: RoleType, name: 'type' })
  type: RoleType;

  @Column({ type: 'enum', enum: RoleStatus, name: 'status', default: RoleStatus.ACTIVE })
  status: RoleStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: Relation<RolePermission>[];
}
