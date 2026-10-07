import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { ServiceCategory } from './entity/service-category.entity';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    DatabaseModule,
    TypeOrmModule.forFeature([
      ServiceCategory,
    ]),
  ],
  providers: [ServiceCategoryService],
  controllers: [ServiceCategoryController],
  exports: [],
})
export class ServiceCategoryModule {}
