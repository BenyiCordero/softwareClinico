import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Patient } from '../../module-patient/entity/patient.entity';
import { ClinicalRecordStatus } from '../enum/clinical-record-status.enum';

@Entity('clinical_record')
export class ClinicalRecord {
  @PrimaryGeneratedColumn()
  clinicalRecordId: number;

  @OneToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @Column({ name: 'record_number', type: 'varchar' })
  recordNumber: string;

  @Column({ name: 'opened_at', type: 'timestamptz' })
  openedAt: Date;

  @Column({ name: 'status', type: 'enum', enum: ClinicalRecordStatus })
  status: ClinicalRecordStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
