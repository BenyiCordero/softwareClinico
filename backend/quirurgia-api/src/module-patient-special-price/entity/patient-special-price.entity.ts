import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Branch } from '../../module-branch/entity/branch.entity';
import { Patient } from '../../module-patient/entity/patient.entity';
import { Service } from '../../module-service/entity/service.entity';
import { User } from '../../module-user/entity/user.entity';
import { SpecialPriceStatus } from '../enum/special-price-status.enum';

@Entity('patient_special_price')
export class PatientSpecialPrice {
  @PrimaryGeneratedColumn()
  patientSpecialPriceId: number;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch> | null;

  @Column({ name: 'price', type: 'numeric', precision: 14, scale: 2 })
  price: string;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: string;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: string | null;

  @Column({ name: 'reason', type: 'text', nullable: true })
  reason: string | null;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'authorized_by' })
  authorizedByUser: Relation<User>;

  @Column({ name: 'status', type: 'enum', enum: SpecialPriceStatus })
  status: SpecialPriceStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
