import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PositionStatus } from '../enum/position-status.enum';

@Entity('position')
@Index('UQ_position_name', ['name'], { unique: true })
export class Position {
  @PrimaryGeneratedColumn()
  positionId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: PositionStatus, name: 'status' })
  status: PositionStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
