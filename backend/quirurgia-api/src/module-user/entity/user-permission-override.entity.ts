import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Branch } from '../../module-branch/entity/branch.entity';
import { Permission } from '../../module-permission/entity/permission.entity';
import { PermissionEffect } from '../enum/permission-effect.enum';
import { PermissionOverrideStatus } from '../enum/permission-override-status.enum';
import { User } from './user.entity';

@Entity('user_permission_override')
export class UserPermissionOverride {
  @PrimaryGeneratedColumn()
  userPermissionOverrideId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission: Relation<Permission>;

  @Column({ type: 'enum', enum: PermissionEffect, name: 'effect' })
  effect: PermissionEffect;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch> | null;

  @Column({ type: 'enum', enum: PermissionOverrideStatus, name: 'status' })
  status: PermissionOverrideStatus;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'valid_from', type: 'timestamptz', nullable: true })
  validFrom: Date | null;

  @Column({ name: 'valid_until', type: 'timestamptz', nullable: true })
  validUntil: Date | null;

  @Column({ name: 'created_by', type: 'integer', nullable: false })
  createdBy: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
