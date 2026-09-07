import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Area } from '../../module-area/entity/area.entity';
import { Branch } from '../../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { ServiceAssignmentStatus } from '../enum/service-assignment-status.enum';
import { Service } from './service.entity';

@Entity('service_assignment')
export class ServiceAssignment {
  @PrimaryGeneratedColumn()
  serviceAssignmentId: number;

  @ManyToOne(() => Service, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: Relation<Service>;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => Area, { nullable: true })
  @JoinColumn({ name: 'area_id' })
  area: Relation<Area> | null;

  @ManyToOne(() => ConsultingRoom, { nullable: true })
  @JoinColumn({ name: 'consulting_room_id' })
  consultingRoom: Relation<ConsultingRoom> | null;

  @ManyToOne(() => HealthProfessional, { nullable: true })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional> | null;

  @Column({ name: 'status', type: 'enum', enum: ServiceAssignmentStatus })
  status: ServiceAssignmentStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
