import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Appointment } from '../../module-appointment/entity/appointment.entity';
import { Branch } from '../../module-branch/entity/branch.entity';
import { ClinicalRecord } from '../../module-clinical-record/entity/clinical-record.entity';
import { ConsultingRoom } from '../../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { Service } from '../../module-service/entity/service.entity';
import { ConsultationStatus } from '../enum/consultation-status.enum';

@Entity('consultation')
export class Consultation {
  @PrimaryGeneratedColumn()
  consultationId: number;

  @ManyToOne(() => ClinicalRecord, { nullable: false })
  @JoinColumn({ name: 'clinical_record_id' })
  clinicalRecord: Relation<ClinicalRecord>;

  @ManyToOne(() => Appointment, { nullable: true })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Relation<Appointment> | null;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => ConsultingRoom, { nullable: true })
  @JoinColumn({ name: 'consulting_room_id' })
  consultingRoom: Relation<ConsultingRoom> | null;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service> | null;

  @Column({ name: 'reason', type: 'text' })
  reason: string;

  @Column({ name: 'clinical_summary', type: 'text', nullable: true })
  clinicalSummary: string | null;

  @Column({ name: 'status', type: 'enum', enum: ConsultationStatus })
  status: ConsultationStatus;

  @Column({ name: 'started_at', type: 'timestamptz' })
  startedAt: Date;

  @Column({ name: 'finished_at', type: 'timestamptz', nullable: true })
  finishedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
