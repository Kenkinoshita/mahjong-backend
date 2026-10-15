import { cookieNames } from '@/shared/consts/cookie';
import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import { createAuthRoute } from '@/modules/auth/route/auth.route';
import type { AuthService } from '@/modules/auth/service/auth.service';
import { errorHandler } from '@/shared/middlewares/errorHandler';
import { ApiError } from '@/shared/errors/apiError';

function setup() {
  const service = {
    register: vi.fn<AuthService['register']>().mockResolvedValue({ userId: 42, accessToken: 'test-access-token' }),
  };
  const app = new Hono();
  app.onError(errorHandler);
  app.route('/api/auth', createAuthRoute(service as unknown as AuthService));
  const register = (body: unknown) =>
    app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  return { service, register };
}

const input = { name: ' Test User ', email: 'test@example.com', password: 'password123' };

describe('POST /api/auth/register', () => {
  it('delegates account creation and issues a session', async () => {
    const { service, register } = setup();
    const response = await register(input);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 42 });
    expect(service.register).toHaveBeenCalledExactlyOnceWith({
      name: 'Test User',
      email: input.email,
      password: input.password,
    });
    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(1);
    const [cookiePair] = cookies[0].split(';');
    const separator = cookiePair.indexOf('=');
    expect(cookiePair.slice(0, separator)).toBe(cookieNames.tokenName);
    const token = decodeURIComponent(cookiePair.slice(separator + 1));
    expect(token).toBe('test-access-token');
  });

  it.each([
    { ...input, name: ' ' },
    { ...input, email: 'invalid' },
    { ...input, password: 'short' },
    { email: input.email, password: input.password },
  ])('rejects invalid input before creating an account', async (body) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { service, register } = setup();
      expect((await register(body)).status).toBe(400);
      expect(service.register).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('returns a conflict if another request registers the email during creation', async () => {
    const { service, register } = setup();
    service.register.mockRejectedValue(ApiError.conflict('Email already registered'));
    expect((await register(input)).status).toBe(409);
  });
});
