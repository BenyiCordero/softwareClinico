import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Area } from '../../module-area/entity/area.entity';
import { Branch } from '../../module-branch/entity/branch.entity';
import { ConsultingRoomStatus } from '../enum/consulting-room-status.enum';

@Entity('consulting_room')
export class ConsultingRoom {
  @PrimaryGeneratedColumn()
  consultingRoomId: number;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => Area, { nullable: true })
  @JoinColumn({ name: 'area_id' })
  area: Relation<Area> | null;

  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'floor', type: 'varchar', nullable: true })
  floor: string | null;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ConsultingRoomStatus, name: 'status' })
  status: ConsultingRoomStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
