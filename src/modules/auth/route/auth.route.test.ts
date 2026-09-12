import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';
import { createAuthRoute } from '@/modules/auth/route/auth.route';
import { AuthService } from '@/modules/auth/service/auth.service';
import type { UserFacade } from '@/modules/user/facade/user.facade';
import { errorHandler } from '@/shared/middlewares/errorHandler';
import { verifyPassword } from '@/shared/password/verifyPassword';
import { ApiError } from '@/shared/errors/apiError';

function setup() {
  const facade = {
    getUserForLogin: vi.fn().mockResolvedValue(null),
    createUser: vi.fn<UserFacade['createUser']>().mockResolvedValue({ id: 42 }),
  };
  const app = new Hono();
  app.onError(errorHandler);
  app.route('/api/auth', createAuthRoute(new AuthService(facade as unknown as UserFacade)));
  const register = (body: unknown) =>
    app.request('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  return { facade, register };
}

const input = { name: ' Test User ', email: 'test@example.com', password: 'password123' };

describe('POST /api/auth/register', () => {
  it('creates an account with a hashed password and returns only its ID', async () => {
    const { facade, register } = setup();
    const response = await register(input);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ userId: 42 });
    const saved = facade.createUser.mock.calls[0][0];
    expect(facade.getUserForLogin).not.toHaveBeenCalled();
    expect(saved.name).toBe('Test User');
    expect(saved.email).toBe(input.email);
    expect(saved.hashedPassword).not.toBe(input.password);
    expect(await verifyPassword(saved.hashedPassword, input.password)).toBe(true);
  });

  it.each([
    { ...input, name: ' ' },
    { ...input, email: 'invalid' },
    { ...input, password: 'short' },
    { email: input.email, password: input.password },
  ])('rejects invalid input before creating an account', async (body) => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { facade, register } = setup();
      expect((await register(body)).status).toBe(400);
      expect(facade.createUser).not.toHaveBeenCalled();
    } finally {
      log.mockRestore();
    }
  });

  it('returns a conflict if another request registers the email during creation', async () => {
    const { facade, register } = setup();
    facade.createUser.mockRejectedValue(ApiError.conflict('Email already registered'));
    expect((await register(input)).status).toBe(409);
  });
});
