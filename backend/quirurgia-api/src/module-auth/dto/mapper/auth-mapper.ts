import { TokenResponseDto } from '../response/token-response.dto';

export class AuthMapper {
  static toTokenResponseDto(
    accessToken: string,
    refreshToken: string,
  ): TokenResponseDto {
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
