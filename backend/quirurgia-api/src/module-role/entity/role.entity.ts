import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleStatus } from '../enum/role-status.enum';
import { RoleType } from '../enum/role-type.enum';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: RoleType, name: 'type' })
  type: RoleType;

  @Column({ type: 'enum', enum: RoleStatus, name: 'status' })
  status: RoleStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
