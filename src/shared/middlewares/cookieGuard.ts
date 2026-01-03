import { cookieNames } from '@/shared/consts/cookie';
import { ApiError } from '@/shared/errors/apiError';
import { AuthTokenManager } from '@/shared/token/auth-token-manager';
import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';

export const cookieGuard: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, cookieNames.tokenName);
  if (!token) throw ApiError.unauthorized('Authentication token is missing');
  const tokenManager = new AuthTokenManager(token);
  const payload = await tokenManager.accessToken.verify();
  c.set('jwtPayload', payload);
  return await next();
};
