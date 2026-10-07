import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SpecialtyStatus } from '../enum/specialty-status.enum';

@Entity('specialty')
@Index('UQ_specialty_name', ['name'], { unique: true })
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
