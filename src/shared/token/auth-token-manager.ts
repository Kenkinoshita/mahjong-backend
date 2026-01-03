import type { JWTClaims } from '@/shared/token/access-token';
import { AccessToken } from '@/shared/token/access-token';

export class AuthTokenManager {
  public readonly accessToken: AccessToken;

  constructor(signedAccessToken?: string) {
    this.accessToken = new AccessToken(signedAccessToken || '');
  }

  async generateSignedAccessTokens(jwtClaims: JWTClaims): Promise<string> {
    const accessToken = await this.accessToken.sign(jwtClaims);
    return accessToken;
  }
}
