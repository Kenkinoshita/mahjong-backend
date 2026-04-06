import type { StatsService } from '@/modules/stats/service/stats.service';
// import { cookieGuard } from '@/shared/middlewares/cookieGuard';
import { Hono } from 'hono';

function createStatsRoute(service: StatsService) {
  const route = new Hono();

  // route.use(cookieGuard);
  route.get('overall-results', async (c) => {
    const overallStats = await service.getOverallStats();
    return c.json(overallStats);
  });

  return route;
}

export { createStatsRoute };
