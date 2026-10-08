import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { ClinicalNoteStatus } from '../enum/clinical-note-status.enum';
import { ClinicalNoteType } from '../enum/clinical-note-type.enum';
import { Consultation } from './consultation.entity';

@Entity('clinical_note')
export class ClinicalNote {
  @PrimaryGeneratedColumn()
  clinicalNoteId: number;

  @ManyToOne(() => Consultation, { nullable: false })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation>;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @Column({ name: 'note_type', type: 'enum', enum: ClinicalNoteType })
  noteType: ClinicalNoteType;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'status', type: 'enum', enum: ClinicalNoteStatus })
  status: ClinicalNoteStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
