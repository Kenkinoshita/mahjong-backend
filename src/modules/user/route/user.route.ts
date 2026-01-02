import type { UserService } from '@/modules/user/service/user.service';
import { Hono } from 'hono';

function createUserRoute(service: UserService) {
  const route = new Hono();

  route.get('/:id', async (c) => {
    const userId = +c.req.param('id');
    const user = await service.getUser({ userId });
    return c.json(user);
  });

  return route;
}

export { createUserRoute };
