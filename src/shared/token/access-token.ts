import { JWT_SECRET_KEY } from '@/shared/consts/jwt';
import { sign, verify } from 'hono/jwt';

export type JWTClaims = {
  userId: number;
};

export class AccessToken {
  private algo = 'HS256' as const;
  private expiresIn = 60 * 60 * 12; // 12時間後
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async sign(payload: JWTClaims): Promise<string> {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + this.expiresIn;
    return await sign({ ...payload, iat, exp }, JWT_SECRET_KEY, this.algo);
  }

  async verify(): Promise<JWTClaims> {
    return (await verify(this.token, JWT_SECRET_KEY, this.algo)) as JWTClaims;
  }
}
