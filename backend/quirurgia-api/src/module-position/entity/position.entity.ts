import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PositionStatus } from '../enum/position-status.enum';

@Entity('position')
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
