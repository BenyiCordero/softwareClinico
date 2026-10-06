import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Area } from '../module-area/entity/area.entity';
import { Branch } from '../module-branch/entity/branch.entity';
import { ConsultingRoom } from '../module-consulting-room/entity/consulting-room.entity';
import { EmployeeAssignment } from '../module-employee/entity/employee-assignment.entity';
import { Employee } from '../module-employee/entity/employee.entity';
import { HealthProfessional } from '../module-health-professional/entity/health-professional.entity';
import { ServiceCategory } from '../module-service-category/entity/service-category.entity';
import { ServiceAssignment } from './entity/service-assignment.entity';
import { ServiceRequirement } from './entity/service-requirement.entity';
import { Service } from './entity/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Service,
      ServiceRequirement,
      ServiceAssignment,
      ServiceCategory,
      Branch,
      Area,
      ConsultingRoom,
      HealthProfessional,
      Employee,
      EmployeeAssignment,
    ]),
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [],
})
export class ServiceModule {}
