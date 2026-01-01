import type { UserService } from '@/modules/user/service/user.service';
import { Hono } from 'hono';

function createUserRoute(service: UserService) {
  const route = new Hono();

  route.get('/:id', (c) => {
    const userId = +c.req.param('id');
    const users = service.getUser({ userId });
    return c.json(users);
  });

  return route;
}

export { createUserRoute };
