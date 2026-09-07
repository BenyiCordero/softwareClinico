import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { ServiceCategoryStatus } from '../enum/service-category-status.enum';

@Entity('service_category')
export class ServiceCategory {
  @PrimaryGeneratedColumn()
  serviceCategoryId: number;

  @ManyToOne(() => ServiceCategory, { nullable: true })
  @JoinColumn({ name: 'parent_category_id' })
  parentCategory: Relation<ServiceCategory> | null;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: ServiceCategoryStatus })
  status: ServiceCategoryStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
