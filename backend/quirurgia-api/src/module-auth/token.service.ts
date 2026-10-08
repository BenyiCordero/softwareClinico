import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PinoLogger } from "nestjs-pino";
import { createHash } from "crypto";
import { AccessTokenPayload } from "./interface/access-token-payload.interface";
import { RefreshTokenPayload } from "./interface/refresth-token-payload.interface";
import { InvalidRefresh } from "./errors/invalid-refresh.exception";

@Injectable()
export class TokenService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(TokenService.name);
    }

    generateAccessToken(payload: AccessTokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_EXPIRATION'),
        });
    }

    generateRefreshToken(payload: RefreshTokenPayload): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRATION'),
        });
    }

    async verifyAccessToken(access: string): Promise<AccessTokenPayload> {
        if (!access) throw new UnauthorizedException();
        try {
            return await this.jwtService.verifyAsync<AccessTokenPayload>(
            access,
            {
                secret: this.configService.getOrThrow<string>(
                'JWT_SECRET',
                ),
                algorithms: ['HS256']
            },
            );
        } catch {
            throw new UnauthorizedException();
        }
    }

    async verifyRefreshToken(refresh: string): Promise<RefreshTokenPayload> {
        if (!refresh) throw new InvalidRefresh();
        let payload: RefreshTokenPayload;
        try {
            payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refresh, {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
                algorithms: ['HS256'],
            });
            return payload;
        } catch {
            this.logger.warn('Invalid refresh token attempt');
            throw new InvalidRefresh();
        }
    }

    hashRefreshToken(token: string): string {
        return createHash('sha256')
            .update(token)
            .digest('hex');
    }

    getRefreshTokenExpiration(token: string): Date {
        const payload = this.jwtService.decode<RefreshTokenPayload>(token);
        if (!payload.exp) throw new Error('Refresh token has no expiration');
        return new Date(payload.exp * 1000);
    }
}