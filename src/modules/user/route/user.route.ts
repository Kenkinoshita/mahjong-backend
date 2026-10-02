import type { UserService } from '@/modules/user/service/user.service';
import type { GetUsersResponse } from '@common/schemas/users/response/getUsersResponseSchema';
import { cookieGuard } from '@/shared/middlewares/cookieGuard';
import { Hono } from 'hono';

function createUserRoute(service: UserService) {
  const route = new Hono();

  route.use(cookieGuard);

  route.get('/', async (c) => {
    const users = await service.getUsers();
    return c.json<GetUsersResponse>(users);
  });

  route.get('/:id', async (c) => {
    const userId = +c.req.param('id');
    const user = await service.getUser({ userId });
    return c.json(user);
  });

  return route;
}

export { createUserRoute };
