import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { DayOfWeek } from '../enum/day-of-week.enum';
import { ScheduleHourStatus } from '../enum/schedule-hour-status.enum';
import { Schedule } from './schedule.entity';

@Entity('schedule_hour')
export class ScheduleHour {
  @PrimaryGeneratedColumn()
  scheduleHourId: number;

  @ManyToOne(() => Schedule, { nullable: false })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Relation<Schedule>;

  @Column({ name: 'day_of_week', type: 'enum', enum: DayOfWeek })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: string;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: string | null;

  @Column({ name: 'status', type: 'enum', enum: ScheduleHourStatus })
  status: ScheduleHourStatus;
}
