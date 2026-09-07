import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { RequirementLevel } from '../enum/requirement-level.enum';
import { ServiceRequirementStatus } from '../enum/service-requirement-status.enum';
import { Service } from './service.entity';

@Entity('service_requirement')
export class ServiceRequirement {
  @PrimaryGeneratedColumn()
  serviceRequirementId: number;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'requirement_level', type: 'enum', enum: RequirementLevel })
  requirementLevel: RequirementLevel;

  @Column({ name: 'sort_order', type: 'integer' })
  sortOrder: number;

  @Column({ name: 'status', type: 'enum', enum: ServiceRequirementStatus })
  status: ServiceRequirementStatus;
}
