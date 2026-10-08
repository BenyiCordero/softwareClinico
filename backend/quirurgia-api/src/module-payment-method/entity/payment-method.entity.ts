import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentMethodStatus } from '../enum/payment-method-status.enum';

@Entity('payment_method')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  paymentMethodId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'status', type: 'enum', enum: PaymentMethodStatus, default: PaymentMethodStatus.ACTIVE })
  status: PaymentMethodStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
