import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SpecialtyStatus } from '../enum/specialty-status.enum';

@Entity('specialty')
export class Specialty {
  @PrimaryGeneratedColumn()
  specialtyId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'status', type: 'enum', enum: SpecialtyStatus })
  status: SpecialtyStatus;
}
