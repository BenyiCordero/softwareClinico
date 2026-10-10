export interface AccessTokenPayload {
  sub: number;
  email: string;
  sid: string;
  iat?: number;
  exp?: number;
}
