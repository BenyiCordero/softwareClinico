import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { ServiceCategory } from '../../module-service-category/entity/service-category.entity';
import { SchedulingType } from '../enum/scheduling-type.enum';
import { ServiceStatus } from '../enum/service-status.enum';

@Entity('service')
export class Service {
  @PrimaryGeneratedColumn()
  serviceId: number;

  @ManyToOne(() => ServiceCategory, { nullable: false })
  @JoinColumn({ name: 'category_id' })
  category: Relation<ServiceCategory>;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'duration_minutes', type: 'integer' })
  durationMinutes: number;

  @Column({ name: 'scheduling_type', type: 'enum', enum: SchedulingType })
  schedulingType: SchedulingType;

  @Column({ name: 'status', type: 'enum', enum: ServiceStatus })
  status: ServiceStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
