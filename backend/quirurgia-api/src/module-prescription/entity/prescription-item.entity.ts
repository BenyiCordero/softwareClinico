import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Prescription } from './prescription.entity';

@Entity('prescription_item')
export class PrescriptionItem {
  @PrimaryGeneratedColumn()
  prescriptionItemId: number;

  @ManyToOne(() => Prescription, { nullable: false })
  @JoinColumn({ name: 'prescription_id' })
  prescription: Relation<Prescription>;

  @Column({ name: 'medication', type: 'varchar' })
  medication: string;

  @Column({ name: 'presentation', type: 'varchar', nullable: true })
  presentation: string | null;

  @Column({ name: 'dose', type: 'varchar' })
  dose: string;

  @Column({ name: 'route', type: 'varchar', nullable: true })
  route: string | null;

  @Column({ name: 'frequency', type: 'varchar' })
  frequency: string;

  @Column({ name: 'duration', type: 'varchar' })
  duration: string;

  @Column({ name: 'instructions', type: 'text', nullable: true })
  instructions: string | null;
}
