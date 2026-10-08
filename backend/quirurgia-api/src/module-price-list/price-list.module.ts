import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Branch } from '../module-branch/entity/branch.entity';
import { PatientCategory } from '../module-patient-category/entity/patient-category.entity';
import { Service } from '../module-service/entity/service.entity';
import { PriceList } from './entity/price-list.entity';
import { PriceListDetail } from './entity/price-list-detail.entity';
import { PriceListController } from './price-list.controller';
import { PriceListService } from './price-list.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      PriceList,
      PriceListDetail,
      Branch,
      PatientCategory,
      Service,
    ]),
  ],
  providers: [PriceListService],
  controllers: [PriceListController],
  exports: [],
})
export class PriceListModule {}
