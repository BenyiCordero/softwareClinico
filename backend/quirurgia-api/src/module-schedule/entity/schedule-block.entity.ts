import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../module-user/entity/user.entity';
import { ScheduleBlockStatus } from '../enum/schedule-block-status.enum';
import { ScheduleBlockType } from '../enum/schedule-block-type.enum';
import { Schedule } from './schedule.entity';

@Entity('schedule_block')
export class ScheduleBlock {
  @PrimaryGeneratedColumn()
  scheduleBlockId: number;

  @ManyToOne(() => Schedule, { nullable: false })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Relation<Schedule>;

  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'block_type', type: 'enum', enum: ScheduleBlockType })
  blockType: ScheduleBlockType;

  @Column({ name: 'status', type: 'enum', enum: ScheduleBlockStatus })
  status: ScheduleBlockStatus;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
