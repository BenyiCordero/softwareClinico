import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Branch } from '../../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../../module-consulting-room/entity/consulting-room.entity';
import { HealthProfessional } from '../../module-health-professional/entity/health-professional.entity';
import { ScheduleStatus } from '../enum/schedule-status.enum';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  scheduleId: number;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => ConsultingRoom, { nullable: true })
  @JoinColumn({ name: 'consulting_room_id' })
  consultingRoom: Relation<ConsultingRoom> | null;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'slot_duration_minutes', type: 'integer' })
  slotDurationMinutes: number;

  @Column({ name: 'status', type: 'enum', enum: ScheduleStatus })
  status: ScheduleStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
