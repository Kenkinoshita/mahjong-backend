import type { GroupService } from '@/modules/group/service/group.service';
import { Hono } from 'hono';

function createGroupRoute(service: GroupService) {
  const route = new Hono();

  route.get('/:id', async (c) => {
    const groupId = +c.req.param('id');
    const group = await service.getGroup({ groupId });
    return c.json(group);
  });

  return route;
}

export { createGroupRoute };
