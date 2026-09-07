import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Order } from '../../module-order/entity/order.entity';
import { PaymentMethod } from '../../module-payment-method/entity/payment-method.entity';
import { User } from '../../module-user/entity/user.entity';
import { PaymentStatus } from '../enum/payment-status.enum';

@Entity('payment')
export class Payment {
  @PrimaryGeneratedColumn()
  paymentId: number;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => PaymentMethod, { nullable: false })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: Relation<PaymentMethod>;

  @Column({ name: 'amount', type: 'numeric', precision: 14, scale: 2 })
  amount: string;

  @Column({ name: 'reference', type: 'varchar', nullable: true })
  reference: string | null;

  @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @Column({ name: 'paid_at', type: 'timestamptz' })
  paidAt: Date;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'registered_by' })
  registrar: Relation<User>;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
