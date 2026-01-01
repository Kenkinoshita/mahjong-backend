import type { GameService } from '@/modules/game/service/game.service';
import { Hono } from 'hono';

function createGameRoute(service: GameService) {
  const route = new Hono();

  route.get('/:id', async (c) => {
    const gameId = +c.req.param('id');
    const game = await service.getGame({ gameId });
    return c.json(game);
  });

  return route;
}

export { createGameRoute };
