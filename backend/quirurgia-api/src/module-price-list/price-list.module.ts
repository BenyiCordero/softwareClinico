import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceList } from './entity/price-list.entity';
import { PriceListDetail } from './entity/price-list-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PriceList,
      PriceListDetail,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PriceListModule {}
