import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Area } from '../module-area/entity/area.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { Person } from '../module-person/entity/person.entity';
import { Position } from '../module-position/entity/position.entity';
import { EmployeeAssignment } from './entity/employee-assignment.entity';
import { Employee } from './entity/employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Employee,
      EmployeeAssignment,
      Person,
      Branch,
      Area,
      Position,
    ]),
  ],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [],
})
export class EmployeeModule {}
