import { StatsService } from '@/modules/stats/service/stats.service';
import { createStatsRoute } from '@/modules/stats/route/stats.route';
import { userFacade } from '@/modules/user/user.module';
import { gameFacade } from '@/modules/game/game.module';

const statsService = new StatsService(userFacade, gameFacade);
const statsRoute = createStatsRoute(statsService);

export { statsRoute };
