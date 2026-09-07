import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Area } from '../../module-area/entity/area.entity';
import { Branch } from '../../module-branch/entity/branch.entity';
import { Position } from '../../module-position/entity/position.entity';
import { AssignmentType } from '../enum/assignment-type.enum';
import { EmployeeAssignmentStatus } from '../enum/employee-assignment-status.enum';
import { Employee } from './employee.entity';

@Entity('employee_assignment')
export class EmployeeAssignment {
  @PrimaryGeneratedColumn()
  employeeAssignmentId: number;

  @ManyToOne(() => Employee, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: Relation<Employee>;

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Relation<Branch>;

  @ManyToOne(() => Area, { nullable: true })
  @JoinColumn({ name: 'area_id' })
  area: Relation<Area> | null;

  @ManyToOne(() => Position, { nullable: false })
  @JoinColumn({ name: 'position_id' })
  position: Relation<Position>;

  @Column({ name: 'assignment_type', type: 'enum', enum: AssignmentType })
  assignmentType: AssignmentType;

  @Column({ name: 'status', type: 'enum', enum: EmployeeAssignmentStatus })
  status: EmployeeAssignmentStatus;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: string | null;
}
