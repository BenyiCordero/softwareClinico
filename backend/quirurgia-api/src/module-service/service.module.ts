import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceAssignment } from './entity/service-assignment.entity';
import { ServiceRequirement } from './entity/service-requirement.entity';
import { Service } from './entity/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Service,
      ServiceRequirement,
      ServiceAssignment,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ServiceModule {}
