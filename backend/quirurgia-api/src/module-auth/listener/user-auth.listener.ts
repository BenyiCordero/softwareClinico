import { Injectable } from '@nestjs/common';
import { AuthSessionService } from '../auth-session.service';
import { OnEvent } from '@nestjs/event-emitter';
import { SessionRevocationReason } from '../interface/session-revocation-reason.interface';

@Injectable()
export class UserAuthListener {
  constructor(private readonly authSessionService: AuthSessionService) {}

  private async revokeActiveSession(
    userId: number,
    reason: SessionRevocationReason,
  ): Promise<void> {
    const session =
      await this.authSessionService.findActiveSessionByUserIdOrNull(userId);
    if (!session) return;
    await this.authSessionService.revokeSession(session.sid, reason);
  }

  @OnEvent('user.disabled')
  async handleUserDisabled(userId: number): Promise<void> {
    await this.revokeActiveSession(userId, 'USER_DISABLED');
  }

  @OnEvent('user.passwordChanged')
  async handlePasswordChanged(userId: number): Promise<void> {
    await this.revokeActiveSession(userId, 'PASSWORD_CHANGED');
  }

  @OnEvent('user.authorizationChanged')
  async handleAuthorizationChanged(userId: number): Promise<void> {
    await this.revokeActiveSession(userId, 'AUTHORIZATION_CHANGED');
  }
}
