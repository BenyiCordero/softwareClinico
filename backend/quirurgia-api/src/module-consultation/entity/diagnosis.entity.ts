import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { DiagnosisPriority } from '../enum/diagnosis-priority.enum';
import { DiagnosisType } from '../enum/diagnosis-type.enum';
import { Consultation } from './consultation.entity';

@Entity('diagnosis')
export class Diagnosis {
  @PrimaryGeneratedColumn()
  diagnosisId: number;

  @ManyToOne(() => Consultation, { nullable: false })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation>;

  @Column({ name: 'code', type: 'varchar', nullable: true })
  code: string | null;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'diagnosis_type', type: 'enum', enum: DiagnosisType })
  diagnosisType: DiagnosisType;

  @Column({ name: 'priority', type: 'enum', enum: DiagnosisPriority })
  priority: DiagnosisPriority;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
