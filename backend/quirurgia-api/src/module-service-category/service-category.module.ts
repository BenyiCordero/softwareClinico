import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entity/service-category.entity';
import { ServiceCategoryController } from './service-category.controller';
import { ServiceCategoryService } from './service-category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCategory,
    ]),
  ],
  providers: [ServiceCategoryService],
  controllers: [ServiceCategoryController],
  exports: [],
})
export class ServiceCategoryModule {}
