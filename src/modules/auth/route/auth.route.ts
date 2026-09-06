import type { AuthService } from '@/modules/auth/service/auth.service';
import type { JWTClaims } from '@/shared/token/access-token';
import { loginRequestSchema } from '@/modules/auth/route/schemas/request/loginRequest';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import type { SuccessResponse } from '@/shared/consts/successResponse';
import { SUCCESS_RESPONSE } from '@/shared/consts/successResponse';
import { cookieNames, cookieOptions } from '@/shared/consts/cookie';
import { requestValidator } from '@/shared/requestValidator';
import { cookieGuard } from '@/shared/middlewares/cookieGuard';
import type { CurrentUserResponse } from '@common/schemas/auth/response/CurrentUserResponseSchema';

function createAuthRoute(service: AuthService) {
  const route = new Hono();

  route.get('/me', cookieGuard, (c) => {
    const { userId } = c.get('jwtPayload') as JWTClaims;
    return c.json<CurrentUserResponse>({ userId });
  });

  route.post('/login', requestValidator('json', loginRequestSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const { accessToken, userId } = await service.login({ email, password });
    setCookie(c, cookieNames.tokenName, accessToken, cookieOptions);
    return c.json<CurrentUserResponse>({ userId });
  });

  route.post('/logout', (c) => {
    deleteCookie(c, cookieNames.tokenName, cookieOptions);
    return c.json<SuccessResponse>(SUCCESS_RESPONSE);
  });

  return route;
}

export { createAuthRoute };
