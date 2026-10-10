import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Person } from '../../module-person/entity/person.entity';
import { UserStatus } from '../enum/user-status.enum';
import { UserRole } from './user-role.entity';
import { UserPermissionOverride } from './user-permission-override.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @ManyToOne(() => Person, { nullable: true })
  @JoinColumn({ name: 'person_id' })
  person: Relation<Person> | null;

  @Column({ name: 'username', type: 'varchar' })
  username: string;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserStatus, name: 'status' })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: Relation<UserRole>[];

  @OneToMany(() => UserPermissionOverride, (override) => override.user)
  permissionOverrides: Relation<UserPermissionOverride>[];
}
