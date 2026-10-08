import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../module-user/entity/user.entity';

@Entity('auth_session')
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  sid!: string;

  @Column({ name: 'refresh_hash', length: 64 })
  refreshHash!: string;

  @Index('UQ_auth_session_current_jti', { unique: true })
  @Column({ name: 'current_jti', type: 'uuid' })
  currentJti!: string;

  @Index('UQ_auth_session_active_user', { unique: true, where: '"revoked_at" IS NULL' })
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<User>;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}