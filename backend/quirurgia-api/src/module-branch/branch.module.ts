import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entity/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Branch,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class BranchModule {}
