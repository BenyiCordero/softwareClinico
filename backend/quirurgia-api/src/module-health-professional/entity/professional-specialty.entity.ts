import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Specialty } from '../../module-specialty/entity/specialty.entity';
import { SpecialtyPriority } from '../enum/specialty-priority.enum';
import { HealthProfessional } from './health-professional.entity';

@Entity('professional_specialties')
export class ProfessionalSpecialty {
  @PrimaryGeneratedColumn()
  professionalSpecialityId: number;

  @ManyToOne(() => HealthProfessional, { nullable: false })
  @JoinColumn({ name: 'health_professional_id' })
  healthProfessional: Relation<HealthProfessional>;

  @ManyToOne(() => Specialty, { nullable: false })
  @JoinColumn({ name: 'specialty_id' })
  specialty: Relation<Specialty>;

  @Column({ name: 'priority', type: 'enum', enum: SpecialtyPriority })
  priority: SpecialtyPriority;
}
