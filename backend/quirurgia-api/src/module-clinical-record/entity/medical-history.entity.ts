import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../module-user/entity/user.entity';
import { ClinicalRecord } from './clinical-record.entity';

@Entity('medical_history')
export class MedicalHistory {
  @PrimaryGeneratedColumn()
  medicalHistoryId: number;

  @ManyToOne(() => ClinicalRecord, { nullable: false })
  @JoinColumn({ name: 'clinical_record_id' })
  clinicalRecord: Relation<ClinicalRecord>;

  @Column({ name: 'family_history', type: 'text', nullable: true })
  familyHistory: string | null;

  @Column({ name: 'personal_pathological_history', type: 'text', nullable: true })
  personalPathologicalHistory: string | null;

  @Column({ name: 'personal_non_pathological_history', type: 'text', nullable: true })
  personalNonPathologicalHistory: string | null;

  @Column({ name: 'surgical_history', type: 'text', nullable: true })
  surgicalHistory: string | null;

  @Column({ name: 'allergies', type: 'text', nullable: true })
  allergies: string | null;

  @Column({ name: 'current_medications', type: 'text', nullable: true })
  currentMedications: string | null;

  @Column({ name: 'gynecological_history', type: 'text', nullable: true })
  gynecologicalHistory: string | null;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'updated_by' })
  updater: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
