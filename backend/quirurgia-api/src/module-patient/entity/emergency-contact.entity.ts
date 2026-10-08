import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { ContactPriority } from '../enum/contact-priority.enum';
import { EmergencyContactStatus } from '../enum/emergency-contact-status.enum';
import { Patient } from './patient.entity';

@Entity('emergency_contact')
export class EmergencyContact {
  @PrimaryGeneratedColumn()
  emergencyContactId: number;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'relationship', type: 'varchar' })
  relationship: string;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'secondary_phone', type: 'varchar', nullable: true })
  secondaryPhone: string | null;

  @Column({ name: 'email', type: 'varchar', nullable: true })
  email: string | null;

  @Column({ name: 'priority', type: 'enum', enum: ContactPriority })
  priority: ContactPriority;

  @Column({ name: 'status', type: 'enum', enum: EmergencyContactStatus })
  status: EmergencyContactStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
