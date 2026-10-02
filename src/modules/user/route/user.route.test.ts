import { Hono } from 'hono';
import { describe, expect, it, vi } from 'vitest';
import { createUserRoute } from '@/modules/user/route/user.route';
import type { UserService } from '@/modules/user/service/user.service';

vi.mock('@/shared/middlewares/cookieGuard', () => ({
  cookieGuard: async (_c: unknown, next: () => Promise<void>) => next(),
}));

describe('GET /api/users', () => {
  it('returns the user list', async () => {
    const users = [{ id: 1, name: '木下', email: 'kinoshita@example.com' }];
    const service = { getUsers: vi.fn().mockResolvedValue(users) };
    const app = new Hono();
    app.route('/api/users', createUserRoute(service as unknown as UserService));

    const response = await app.request('/api/users');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(users);
    expect(service.getUsers).toHaveBeenCalledOnce();
  });
});
