import { Module } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        genReqId: (req) => req.headers['x-correlation-id'] || randomUUID(),
        redact: {
          paths: [
            'req.body.password',
            'req.body.passwordHash',
            'req.body.password_hash',
            'req.body.newPassword',
            'req.body.currentPassword',
            'req.body.accessToken',
            'req.body.refreshToken',
            'req.body.access_token',
            'req.body.refresh_token',
            'req.body.refreshTokenHash',
            'req.body.refresh_token_hash',
            'req.headers.authorization',
            'req.headers.cookie',
            'req.cookies',
          ],
          censor: '[REDACTED]',
        },
      },
    }),
  ],
})
export class LoggerConfigModule {}
