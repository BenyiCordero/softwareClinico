import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { PatientCategory } from '../../module-patient-category/entity/patient-category.entity';
import { Person } from '../../module-person/entity/person.entity';
import { BloodType } from '../enum/blood-type.enum';
import { PatientStatus } from '../enum/patient-status.enum';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  patientId: number;

  @ManyToOne(() => Person, { nullable: false })
  @JoinColumn({ name: 'person_id' })
  person: Relation<Person>;

  @Column({ name: 'patient_number', type: 'varchar' })
  patientNumber: string;

  @ManyToOne(() => PatientCategory, { nullable: false })
  @JoinColumn({ name: 'patient_category_id' })
  patientCategory: Relation<PatientCategory>;

  @Column({ name: 'blood_type', type: 'enum', enum: BloodType, nullable: true })
  bloodType: BloodType | null;

  @Column({ name: 'allergies_summary', type: 'text', nullable: true })
  allergiesSummary: string | null;

  @Column({ name: 'status', type: 'enum', enum: PatientStatus })
  status: PatientStatus;

  @Column({ name: 'registered_at', type: 'timestamptz' })
  registeredAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
