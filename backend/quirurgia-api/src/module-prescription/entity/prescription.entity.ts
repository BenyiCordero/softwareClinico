import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Consultation } from '../../module-consultation/entity/consultation.entity';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { PrescriptionStatus } from '../enum/prescription-status.enum';

@Entity('prescription')
export class Prescription {
  @PrimaryGeneratedColumn()
  prescriptionId: number;

  @ManyToOne(() => Consultation, { nullable: false })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation>;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @Column({ name: 'issued_at', type: 'timestamptz' })
  issuedAt: Date;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'status', type: 'enum', enum: PrescriptionStatus })
  status: PrescriptionStatus;
}
