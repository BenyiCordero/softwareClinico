import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Branch } from '../module-branch/entity/branch.entity';
import { Area } from './entity/area.entity';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Area,
      Branch,
    ]),
  ],
  providers: [AreaService],
  controllers: [AreaController],
  exports: [],
})
export class AreaModule {}
