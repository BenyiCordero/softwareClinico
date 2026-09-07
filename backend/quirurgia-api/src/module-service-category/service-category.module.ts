import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entity/service-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ServiceCategory,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ServiceCategoryModule {}
