export interface RefreshTokenPayload {
  sub: number;
  sid: string;
  jti: string;
  iat?: number;
  exp?: number;
}
