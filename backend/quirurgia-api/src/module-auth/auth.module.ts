import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthSession } from './entity/session.entity';
import { AuthService } from './auth.service';
import { AuthSessionService } from './auth-session.service';
import { TokenService } from './token.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserAuthListener } from './listener/user-auth.listener';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../module-user/user.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([
      AuthSession,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET')!,
        signOptions: {
          expiresIn:
            config.get<string>(
              'JWT_EXPIRATION',
            ) as StringValue,
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthSessionService,
    TokenService,
    JwtStrategy,
    UserAuthListener
  ],
  controllers: [
    AuthController
  ],
  exports: [
    JwtModule,
    PassportModule,
    AuthSessionService
  ],
})
export class AuthModule {}
