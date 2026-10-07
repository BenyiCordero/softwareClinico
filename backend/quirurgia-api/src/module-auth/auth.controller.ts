import { Controller, Post, Body, Headers, Res, Req, HttpCode } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { TokenResponseDto } from './dto/response/token-response.dto';
import { LoginDto } from './dto/request/login.dto';
import { InvalidRefresh } from './errors/invalid-refresh.exception';

/**
 * Authentication endpoints for login, token refresh, and logout.
 * Responses set httpOnly cookies by default; token-based variants return JSON.
 * Login and refresh routes, plus cookie logout, are throttled to 5 requests per minute.
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(204)
  @Post('login')
  async loginCookies(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<void> {
    const response: TokenResponseDto = await this.authService.login(loginDto);
    this.setAuthCookies(res, response.accessToken, response.refreshToken);
  }

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(204)
  @Post('refresh')
  async refreshCookies(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies?.['refresh_token'];
    const response: TokenResponseDto = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, response.accessToken, response.refreshToken);
  }

  @HttpCode(204)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request): Promise<void> {
    const refreshToken = req.cookies?.['refresh_token'];
    if(refreshToken) await this.authService.logout(refreshToken);
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
  }

  @HttpCode(204)
  @Post('logout/token')
  async logoutToken(@Headers('authorization') authHeader?: string): Promise<void> {
    if (!authHeader?.startsWith('Bearer ')) throw new InvalidRefresh();
    const refreshToken: string = authHeader.split(' ')[1];
    if (!refreshToken) throw new InvalidRefresh();
    await this.authService.logout(refreshToken);
  }

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('COOKIE_SECURE'),
      sameSite: 'lax',
      maxAge: this.configService.getOrThrow('COOKIE_ACCESS_MAX_AGE'),
      path: '/',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: this.configService.getOrThrow('COOKIE_SECURE'),
      sameSite: 'lax',
      maxAge: this.configService.getOrThrow('COOKIE_REFRESH_MAX_AGE'),
      path: '/',
    });
  }
}
