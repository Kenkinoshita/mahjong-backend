import { errorHandler } from '@/shared/middlewares/errorHandler';
import { Hono } from 'hono';
import { describe, expect, it, vi } from 'vitest';
import { createUserRoute } from '@/modules/user/route/user.route';
import type { UserService } from '@/modules/user/service/user.service';

vi.mock('@/shared/middlewares/cookieGuard', () => ({
  cookieGuard: async (_c: unknown, next: () => Promise<void>) => next(),
}));

function setup() {
  const service = {
    deleteUser: vi.fn<UserService['deleteUser']>().mockResolvedValue(undefined),
    getUsers: vi.fn<UserService['getUsers']>().mockResolvedValue([]),
    createUser: vi.fn<UserService['createUser']>().mockResolvedValue({ id: 42 }),
  };
  const app = new Hono();
  app.onError(errorHandler);
  app.route('/api/users', createUserRoute(service as unknown as UserService));

  const createUser = (body: unknown) =>
    app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  return { service, app, createUser };
}

describe('GET /api/users', () => {
  it('returns the user list', async () => {
    const users = [{ id: 1, name: '木下', email: 'kinoshita@example.com' }];
    const { service, app } = setup();
    service.getUsers.mockResolvedValue(users);

    const response = await app.request('/api/users');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(users);
    expect(service.getUsers).toHaveBeenCalledOnce();
  });
});

describe('POST /api/users', () => {
  it('registers a member without changing the session cookie', async () => {
    const { service, createUser } = setup();
    const response = await createUser({ name: ' 木下 ', email: 'member@example.com', password: 'password123' });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 42 });
    expect(response.headers.get('set-cookie')).toBeNull();
    expect(service.createUser).toHaveBeenCalledWith({
      name: '木下',
      email: 'member@example.com',
      password: 'password123',
    });
  });

  it('rejects invalid input before calling the service', async () => {
    const { service, createUser } = setup();
    const response = await createUser({ name: ' ', email: 'invalid', password: 'short' });
    expect(response.status).toBe(400);
    expect(service.createUser).not.toHaveBeenCalled();
  });
});

describe('DELETE /api/users/:id', () => {
  it('deletes a user and returns no content', async () => {
    const { service, app } = setup();
    const response = await app.request('/api/users/42', { method: 'DELETE' });
    expect(response.status).toBe(204);
    expect(service.deleteUser).toHaveBeenCalledWith(42);
  });
  it.each(['abc', '0', '-1', '1.5', '1e2', '0x2a', 'Infinity', '9007199254740992'])(
    'rejects invalid ID %s',
    async (id) => {
      const { service, app } = setup();
      expect((await app.request(`/api/users/${id}`, { method: 'DELETE' })).status).toBe(400);
      expect(service.deleteUser).not.toHaveBeenCalled();
    },
  );
});
