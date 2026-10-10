import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Branch } from './entity/branch.entity';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([Branch]),
  ],
  providers: [BranchService],
  controllers: [BranchController],
  exports: [],
})
export class BranchModule {}
