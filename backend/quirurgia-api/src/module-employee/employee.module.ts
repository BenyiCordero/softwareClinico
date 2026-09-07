import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAssignment } from './entity/employee-assignment.entity';
import { Employee } from './entity/employee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeAssignment,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class EmployeeModule {}
