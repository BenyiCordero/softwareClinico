import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Branch } from '../../module-branch/entity/branch.entity';
import { PatientCategory } from '../../module-patient-category/entity/patient-category.entity';
import { PriceListStatus } from '../enum/price-list-status.enum';

@Entity('price_lists')
export class PriceList {
  @PrimaryGeneratedColumn()
  priceListId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @ManyToOne(() => Branch, { nullable: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch> | null;

  @ManyToOne(() => PatientCategory, { nullable: true })
  @JoinColumn({ name: 'patient_category_id' })
  patientCategory: Relation<PatientCategory> | null;

  @Column({ name: 'currency', type: 'varchar' })
  currency: string;

  @Column({ name: 'valid_from', type: 'date' })
  validFrom: string;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: string | null;

  @Column({ name: 'priority', type: 'integer' })
  priority: number;

  @Column({ name: 'status', type: 'enum', enum: PriceListStatus })
  status: PriceListStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
