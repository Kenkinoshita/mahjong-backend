import type { AuthService } from '@/modules/auth/service/auth.service';
import { loginRequestSchema } from '@/modules/auth/route/schemas/request/loginRequest';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { SUCCESS_RESPONSE } from '@/shared/consts/successResponse';
import { cookieNames, cookieOptions } from '@/shared/consts/cookie';
import { requestValidator } from '@/shared/requestValidator';

function createAuthRoute(service: AuthService) {
  const route = new Hono();

  route.post('/login', requestValidator('json', loginRequestSchema), async (c) => {
    const { email, password } = c.req.valid('json');
    const { accessToken } = await service.login({ email, password });
    setCookie(c, cookieNames.tokenName, accessToken, cookieOptions);
    return c.json(SUCCESS_RESPONSE);
  });

  route.post('/logout', (c) => {
    deleteCookie(c, cookieNames.tokenName, cookieOptions);
    return c.json(SUCCESS_RESPONSE);
  });

  return route;
}

export { createAuthRoute };
