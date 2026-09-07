import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Employee } from '../../module-employee/entity/employee.entity';
import { HealthProfessionalStatus } from '../enum/health-professional-status.enum';

@Entity('health_professional')
export class HealthProfessional {
  @PrimaryGeneratedColumn()
  healthProfessionalId: number;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Relation<Employee>;

  @Column({ name: 'professional_license', type: 'varchar' })
  professionalLicense: string;

  @Column({ name: 'specialty_license', type: 'varchar', nullable: true })
  specialtyLicense: string | null;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio: string | null;

  @Column({ name: 'status', type: 'enum', enum: HealthProfessionalStatus })
  status: HealthProfessionalStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
