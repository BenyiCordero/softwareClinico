import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entity/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Session,
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class AuthModule {}
