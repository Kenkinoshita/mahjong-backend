import type { StatsService } from '@/modules/stats/service/stats.service';
import { Hono } from 'hono';

function createStatsRoute(service: StatsService) {
  const route = new Hono();

  // 支持: /stats?userId=...&from=...&to=...&limit=...
  route.get('/', async (c) => {
    // const query = Object.fromEntries(c.req.query());
    // const parsed = getStatsRequestSchema.safeParse(query);
    // if (!parsed.success) {
    //   return c.json({ error: parsed.error.format() }, 400);
    // }

    // const { userId, from, to, limit } = parsed.data;
    // ここでは userId を文字列で渡す想定
    const stats = await service.getStatistics({});
    // 必要に応じて from/to/limit を service に渡すように拡張できます
    return c.json(stats);
  });

  return route;
}

export { createStatsRoute };
