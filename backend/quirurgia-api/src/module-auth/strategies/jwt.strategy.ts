import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../module-user/user.service';
import { UserStatus } from '../../module-user/enum/user-status.enum';
import { AccessTokenPayload } from '../interface/access-token-payload.interface';
import { AuthSessionService } from '../auth-session.service';
import { AuthSession } from '../entity/session.entity';

/**
 * Passport strategy that validates JWT tokens from cookies or the Authorization header.
 * Every request must reference an active session owned by an enabled user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly authSessionService: AuthSessionService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) throw new Error('JWT_SECRET is not defined');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req?.cookies?.['access_token'],
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * @throws UnauthorizedException if the session is inactive, missing, or belongs to another user
   * @throws UnauthorizedException if the user is missing or is not active
   */
  async validate(payload: AccessTokenPayload) {
    const session: AuthSession | null =
      await this.authSessionService.findActiveSessionBySidOrNull(payload.sid);
    if (!session) throw new UnauthorizedException();
    const user = await this.userService.findUserById(payload.sub);
    if (!user) throw new UnauthorizedException();
    if (user.status !== UserStatus.ACTIVE) throw new UnauthorizedException();
    if (session.user.userId !== payload.sub) throw new UnauthorizedException();
    return user;
  }
}
