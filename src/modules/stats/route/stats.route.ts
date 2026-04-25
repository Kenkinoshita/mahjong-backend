import type { StatsService } from '@/modules/stats/service/stats.service';
import type { OverAllResultResponse } from '@common/schemas/stats/response/OverAllResultResponseSchema';
// import { cookieGuard } from '@/shared/middlewares/cookieGuard';
import { Hono } from 'hono';

function createStatsRoute(service: StatsService) {
  const route = new Hono();

  // route.use(cookieGuard);
  route.get('overall-results', async (c) => {
    const overallStats = await service.getOverallStats();
    return c.json<OverAllResultResponse>(overallStats);
  });

  return route;
}

export { createStatsRoute };
