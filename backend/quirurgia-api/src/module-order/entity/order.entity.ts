import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Appointment } from '../../module-appointment/entity/appointment.entity';
import { Branch } from '../../module-branch/entity/branch.entity';
import { Consultation } from '../../module-consultation/entity/consultation.entity';
import { Patient } from '../../module-patient/entity/patient.entity';
import { User } from '../../module-user/entity/user.entity';
import { OrderStatus } from '../enum/order-status.enum';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column({ name: 'folio', type: 'varchar' })
  folio: string;

  @ManyToOne(() => Patient, { nullable: false })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<Patient>;

  @ManyToOne(() => Appointment, { nullable: true })
  @JoinColumn({ name: 'appointment_id' })
  appointment: Relation<Appointment> | null;

  @ManyToOne(() => Consultation, { nullable: true })
  @JoinColumn({ name: 'consultation_id' })
  consultation: Relation<Consultation> | null;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @Column({ name: 'status', type: 'enum', enum: OrderStatus })
  status: OrderStatus;

  @Column({ name: 'subtotal', type: 'numeric', precision: 14, scale: 2 })
  subtotal: string;

  @Column({ name: 'discount', type: 'numeric', precision: 14, scale: 2 })
  discount: string;

  @Column({ name: 'tax', type: 'numeric', precision: 14, scale: 2 })
  tax: string;

  @Column({ name: 'total', type: 'numeric', precision: 14, scale: 2 })
  total: string;

  @Column({ name: 'balance', type: 'numeric', precision: 14, scale: 2 })
  balance: string;

  @Column({ name: 'created_by', type: 'integer' })
  createdBy: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'created_by' })
  creator: Relation<User>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
