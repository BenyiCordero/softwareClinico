import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entity/person.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Person,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class PersonModule {}
