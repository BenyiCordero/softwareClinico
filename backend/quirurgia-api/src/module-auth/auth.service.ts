import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PinoLogger } from 'nestjs-pino';
import { UserStatus } from '../module-user/enum/user-status.enum';
import { UserService } from '../module-user/user.service';
import { TokenService } from './token.service';
import { AuthSessionService } from './auth-session.service';
import { User } from '../module-user/entity/user.entity';
import { InvalidCredentials } from './errors/invalid-credentials.exception';
import { UserAccountDisabled } from './errors/user-account-disabled.exception';
import { LoginDto } from './dto/request/login.dto';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { AccessTokenPayload } from './interface/access-token-payload.interface';
import { RefreshTokenPayload } from './interface/refresth-token-payload.interface';
import { AuthMapper } from './dto/mapper/auth-mapper';
import { AuthSession } from './entity/session.entity';
import { RefreshTokenDue } from './errors/refresh-token-due.exception';
import { UserNoLongerExistsException } from './errors/user-no-longer-exists';
import { InvalidRefresh } from './errors/invalid-refresh.exception';

/**
 * Manages authentication sessions and token pairs. Login replaces the user's
 * active session; refresh rotates the refresh token and revokes the session
 * when reuse or a rotation conflict is detected.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
    private readonly tokenService: TokenService,
    private readonly authSessionService: AuthSessionService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  /**
   * Validates email/password credentials.
   * Checks user existence, password match, and account status.
   * @throws InvalidCredentials when credentials are wrong
   * @throws UserAccountDisabled when the user is disabled
   */
  async validateCredentials(email: string, pass: string): Promise<User> {
    const user: User | null = await this.userService.findByEmail(email);

    if (
      !user ||
      !(await this.userService.verifyPassword(pass, user.passwordHash))
    ) {
      this.logger.debug({ userId: user?.userId ?? null }, 'Login rejected');
      throw new InvalidCredentials();
    }

    if (user.status === UserStatus.DISABLED) {
      this.logger.warn(
        { userId: user.userId },
        'Login rejected for disabled user',
      );
      throw new UserAccountDisabled();
    }

    return user;
  }

  /** Authenticates the user, replaces any active session, and returns a token pair. */
  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.validateCredentials(
      loginDto.email,
      loginDto.password,
    );
    const sid = randomUUID();
    const jti = randomUUID();
    const accessPayload: AccessTokenPayload = this.buildAccessPayload(
      user,
      sid,
    );
    const refreshPayload: RefreshTokenPayload = this.buildRefreshPayload(
      user,
      sid,
      jti,
    );
    const accessToken = this.tokenService.generateAccessToken(accessPayload);
    const refreshToken = this.tokenService.generateRefreshToken(refreshPayload);
    const refreshHash = this.tokenService.hashRefreshToken(refreshToken);
    const refreshExpiration =
      this.tokenService.getRefreshTokenExpiration(refreshToken);
    await this.authSessionService.replaceActiveSession(
      user,
      sid,
      jti,
      refreshHash,
      refreshExpiration,
    );
    this.logger.info({ userId: user.userId }, 'User logged in');
    return AuthMapper.toTokenResponseDto(accessToken, refreshToken);
  }

  async logout(refresh: string): Promise<void> {
    if (!refresh) return;
    let payload: RefreshTokenPayload;
    try {
      payload = await this.tokenService.verifyRefreshToken(refresh);
    } catch {
      return;
    }
    const session = await this.authSessionService.findActiveSessionBySidOrNull(
      payload.sid,
    );
    if (!session) return;
    const presentedHash = this.tokenService.hashRefreshToken(refresh);
    if (
      session.user.userId !== payload.sub ||
      session.refreshHash !== presentedHash
    )
      return;
    await this.authSessionService.revokeSession(payload.sid, 'LOGOUT');
  }

  /**
   * Rotates a refresh token and issues a new token pair.
   * Reuse, ownership mismatch, or a concurrent rotation revokes the session.
   * @throws InvalidRefresh when verification or rotation fails
   * @throws RefreshTokenDue when reuse or ownership mismatch is detected
   * @throws UserNoLongerExistsException when the token's user no longer exists
   * @throws UserAccountDisabled when the token's user is disabled
   */
  async refreshToken(refresh: string): Promise<TokenResponseDto> {
    const payload: RefreshTokenPayload =
      await this.tokenService.verifyRefreshToken(refresh);
    const session: AuthSession =
      await this.authSessionService.findActiveSessionBySid(payload.sid);
    const presentedHash = this.tokenService.hashRefreshToken(refresh);
    if (
      session.user.userId !== payload.sub ||
      session.currentJti !== payload.jti ||
      session.refreshHash !== presentedHash
    ) {
      await this.authSessionService.revokeSession(payload.sid, 'REFRESH_REUSE');
      this.logger.warn(
        { sid: payload.sid, jti: payload.jti },
        'Refresh token reuse detected',
      );
      throw new RefreshTokenDue();
    }
    const user: User | null = await this.userService.findUserById(payload.sub);
    if (!user) throw new UserNoLongerExistsException();
    if (user.status === UserStatus.DISABLED) {
      await this.authSessionService.revokeSession(payload.sid, 'USER_DISABLED');
      this.logger.warn(
        { userId: user.userId, sid: payload.sid },
        'Refresh rejected for disabled user',
      );
      throw new UserAccountDisabled();
    }
    const sid = payload.sid;
    const jti = randomUUID();
    const accessPayload: AccessTokenPayload = this.buildAccessPayload(
      user,
      sid,
    );
    const refreshPayload: RefreshTokenPayload = this.buildRefreshPayload(
      user,
      sid,
      jti,
    );
    const accessToken: string =
      this.tokenService.generateAccessToken(accessPayload);
    const newRefreshToken: string =
      this.tokenService.generateRefreshToken(refreshPayload);
    const newHash = this.tokenService.hashRefreshToken(newRefreshToken);
    const expiresAt =
      this.tokenService.getRefreshTokenExpiration(newRefreshToken);
    const rotated = await this.authSessionService.rotateRefresh(
      payload.sid,
      payload.jti,
      presentedHash,
      jti,
      newHash,
      expiresAt,
    );
    if (!rotated) {
      this.logger.warn(
        { sid: payload.sid, jti: payload.jti },
        'Refresh rotation conflict detected',
      );
      await this.authSessionService.revokeSession(
        payload.sid,
        'REFRESH_ROTATION_FAILED',
      );
      throw new InvalidRefresh();
    }
    return AuthMapper.toTokenResponseDto(accessToken, newRefreshToken);
  }

  private buildAccessPayload(user: User, sid: string): AccessTokenPayload {
    return {
      sub: user.userId,
      email: user.email,
      sid: sid,
    };
  }

  private buildRefreshPayload(
    user: User,
    sid: string,
    jti: string,
  ): RefreshTokenPayload {
    return {
      sub: user.userId,
      sid: sid,
      jti: jti,
    };
  }
}
