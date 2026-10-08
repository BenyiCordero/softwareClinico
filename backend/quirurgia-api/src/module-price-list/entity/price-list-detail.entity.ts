import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Service } from '../../module-service/entity/service.entity';
import { PriceDetailStatus } from '../enum/price-detail-status.enum';
import { PriceList } from './price-list.entity';

@Entity('price_list_detail')
@Unique('UQ_price_list_details_price_list_service', ['priceList', 'service'])
export class PriceListDetail {
  @PrimaryGeneratedColumn()
  priceListDetailId: number;

  @ManyToOne(() => PriceList, { nullable: false })
  @JoinColumn({ name: 'price_list_id' })
  priceList: Relation<PriceList>;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @Column({ name: 'price', type: 'numeric', precision: 14, scale: 2 })
  price: string;

  @Column({ name: 'status', type: 'enum', enum: PriceDetailStatus })
  status: PriceDetailStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
