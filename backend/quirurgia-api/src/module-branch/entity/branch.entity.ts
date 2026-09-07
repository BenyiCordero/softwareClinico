import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { BranchStatus } from '../enum/branch-status.enum';

@Entity('branch')
export class Branch {
  @PrimaryGeneratedColumn()
  branchId: number;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'address', type: 'varchar' })
  address: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'state', type: 'varchar' })
  state: string;

  @Column({ name: 'postal_code', type: 'varchar' })
  postalCode: string;

  @Column({ name: 'timezone', type: 'varchar' })
  timezone: string;

  @Column({ type: 'enum', enum: BranchStatus, name: 'status' })
  status: BranchStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
