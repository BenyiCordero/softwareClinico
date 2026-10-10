import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PatientCategoryStatus } from '../enum/patient-category-status.enum';

@Entity('patient_category')
@Index('UQ_patient_category_name', ['name'], { unique: true })
export class PatientCategory {
  @PrimaryGeneratedColumn()
  patientCategoryId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: PatientCategoryStatus })
  status: PatientCategoryStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
