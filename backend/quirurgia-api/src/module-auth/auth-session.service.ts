import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, MoreThan, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SessionRevocationReason } from './interface/session-revocation-reason.interface';
import { SessionRevokedPayload } from './interface/session-revoked-payload.interface';
import { AuthSession } from './entity/session.entity';
import { InvalidRefresh } from './errors/invalid-refresh.exception';
import { User } from '../module-user/entity/user.entity';

@Injectable()
export class AuthSessionService {
  constructor(
    @InjectRepository(AuthSession)
    private readonly authSessionRepository: Repository<AuthSession>,
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async revokeSession(
    sid: string,
    reason: SessionRevocationReason,
  ): Promise<boolean> {
    const result = await this.authSessionRepository.update(
      {
        sid,
        revokedAt: IsNull(),
      },
      { revokedAt: new Date() },
    );
    if (result.affected !== 1) return false;
    const event: SessionRevokedPayload = {
      sid,
      reason,
    };
    this.eventEmitter.emit('auth.session.revoked', event);
    return true;
  }

  async rotateRefresh(
    sid: string,
    expectedJti: string,
    expectedHash: string,
    newJti: string,
    newHash: string,
    expiresAt: Date,
  ): Promise<boolean> {
    const result = await this.authSessionRepository.update(
      {
        sid,
        currentJti: expectedJti,
        refreshHash: expectedHash,
        revokedAt: IsNull(),
      },
      {
        currentJti: newJti,
        refreshHash: newHash,
        expiresAt,
      },
    );
    return result.affected === 1;
  }

  async findActiveSessionByUserIdOrNull(
    userId: number,
  ): Promise<AuthSession | null> {
    return await this.authSessionRepository.findOne({
      where: {
        user: {
          userId: userId,
        },
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { user: true },
    });
  }

  async findActiveSessionBySid(sid: string): Promise<AuthSession> {
    const session = await this.authSessionRepository.findOne({
      where: {
        sid: sid,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { user: true },
    });
    if (!session) throw new InvalidRefresh();
    return session;
  }

  async findActiveSessionBySidOrNull(sid: string): Promise<AuthSession | null> {
    return this.authSessionRepository.findOne({
      where: {
        sid: sid,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: { user: true },
    });
  }

  async replaceActiveSession(
    user: User,
    sid: string,
    jti: string,
    refreshHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const repository = queryRunner.manager.getRepository(AuthSession);
      const currentSession = await repository.findOne({
        where: {
          user: {
            userId: user.userId,
          },
          revokedAt: IsNull(),
        },
        relations: {
          user: true,
        },
      });
      if (currentSession) {
        currentSession.revokedAt = new Date();
        await repository.save(currentSession);
      }
      const newSession = repository.create({
        user,
        sid,
        currentJti: jti,
        refreshHash,
        expiresAt,
        revokedAt: null,
      });
      await repository.save(newSession);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
