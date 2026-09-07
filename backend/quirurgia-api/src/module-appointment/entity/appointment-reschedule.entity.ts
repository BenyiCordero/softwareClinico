import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../module-user/entity/user.entity';
import { Appointment } from './appointment.entity';

@Entity('appointment_reschedule')
export class AppointmentReschedule {
  @PrimaryGeneratedColumn()
  appointmentRescheduleId: number;

  @ManyToOne(() => Appointment, { nullable: false })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Relation<Appointment>;

  @Column({ name: 'previous_start_at', type: 'timestamptz' })
  previousStartAt: Date;

  @Column({ name: 'previous_end_at', type: 'timestamptz' })
  previousEndAt: Date;

  @Column({ name: 'new_start_at', type: 'timestamptz' })
  newStartAt: Date;

  @Column({ name: 'new_end_at', type: 'timestamptz' })
  newEndAt: Date;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'changed_by' })
  changedByUser: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
