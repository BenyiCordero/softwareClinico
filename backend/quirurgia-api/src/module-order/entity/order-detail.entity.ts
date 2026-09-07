import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Service } from '../../module-service/entity/service.entity';
import { OrderDetailStatus } from '../enum/order-detail-status.enum';
import { Order } from './order.entity';

@Entity('order_detail')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  orderDetailId: number;

  @ManyToOne(() => Order, { nullable: false })
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'quantity', type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 14, scale: 2 })
  unitPrice: string;

  @Column({ name: 'discount', type: 'numeric', precision: 14, scale: 2 })
  discount: string;

  @Column({ name: 'tax', type: 'numeric', precision: 14, scale: 2 })
  tax: string;

  @Column({ name: 'total', type: 'numeric', precision: 14, scale: 2 })
  total: string;

  @Column({ name: 'status', type: 'enum', enum: OrderDetailStatus })
  status: OrderDetailStatus;
}
