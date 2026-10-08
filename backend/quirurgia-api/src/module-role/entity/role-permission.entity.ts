import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { Permission } from '../../module-permission/entity/permission.entity';
import { Role } from './role.entity';

@Entity('role_permission')
@Unique('UQ_role_permissions_role_permission', ['role', 'permission'])
export class RolePermission {
  @PrimaryGeneratedColumn()
  rolePermissionId: number;

  @ManyToOne(() => Role, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @ManyToOne(() => Permission, { nullable: false })
  @JoinColumn({ name: 'permission_id' })
  permission: Relation<Permission>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
