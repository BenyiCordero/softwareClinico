import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Branch } from '../../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { Patient } from '../../module-patient/entity/patient.entity';
import { Schedule } from '../../module-schedule/entity/schedule.entity';
import { Service } from '../../module-service/entity/service.entity';
import { User } from '../../module-user/entity/user.entity';
import { AppointmentStatus } from '../enum/appointment-status.enum';

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  appointmentId: number;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => Schedule, { nullable: false })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Relation<Schedule>;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => ConsultingRoom, { nullable: true })
  @JoinColumn({ name: 'consulting_room_id' })
  consultingRoom: Relation<ConsultingRoom> | null;

  @Column({ name: 'start_at', type: 'timestamptz' })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamptz' })
  endAt: Date;

  @Column({ name: 'status', type: 'enum', enum: AppointmentStatus })
  status: AppointmentStatus;

  @Column({ name: 'reason_for_visit', type: 'text', nullable: true })
  reasonForVisit: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'price_at_booking', type: 'numeric', precision: 14, scale: 2, nullable: true })
  priceAtBooking: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: Relation<User>;

  @Column({ name: 'confirmed_at', type: 'timestamptz', nullable: true })
  confirmedAt: Date | null;

  @Column({ name: 'cancelled_at', type: 'timestamptz', nullable: true })
  cancelledAt: Date | null;

  @Column({ name: 'checked_in_at', type: 'timestamptz', nullable: true })
  checkedInAt: Date | null;

  @Column({ name: 'started_at', type: 'timestamptz', nullable: true })
  startedAt: Date | null;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
