import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { TreatmentStatus } from '../enum/treatment-status.enum';
import { Consultation } from './consultation.entity';

@Entity('treatment')
export class Treatment {
  @PrimaryGeneratedColumn()
  treatmentId: number;

  @ManyToOne(() => Consultation, { nullable: false })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation>;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'instructions', type: 'text' })
  instructions: string;

  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: string | null;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string | null;

  @Column({ name: 'status', type: 'enum', enum: TreatmentStatus })
  status: TreatmentStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
