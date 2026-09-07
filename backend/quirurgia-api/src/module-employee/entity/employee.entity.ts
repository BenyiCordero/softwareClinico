import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Person } from '../../module-person/entity/person.entity';
import { EmployeeStatus } from '../enum/employee-status.enum';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn()
  employeeId: number;

  @ManyToOne(() => Person, { nullable: false })
  @JoinColumn({ name: 'person_id' })
  person: Relation<Person>;

  @Column({ name: 'employee_number', type: 'varchar' })
  employeeNumber: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: string;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate: string | null;

  @Column({ name: 'status', type: 'enum', enum: EmployeeStatus })
  status: EmployeeStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
