import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../common/module/database.module';
import { Person } from './entity/person.entity';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    DatabaseModule,
    TypeOrmModule.forFeature([
      Person,
    ]),
  ],
  providers: [PersonService],
  controllers: [PersonController],
  exports: [PersonService],
})
export class PersonModule {}
