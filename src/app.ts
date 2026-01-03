import { authRoute } from '@/modules/auth/auth.module';
import { gameRoute } from '@/modules/game/game.module';
import { groupRoute } from '@/modules/group/group.module';
import { statsRoute } from '@/modules/stats/stats.module';
import { userRoute } from '@/modules/user/user.module';
import { errorHandler } from '@/shared/middlewares/errorHandler';
import { Hono } from 'hono';

const app = new Hono().basePath('/api');

app.onError(errorHandler);

app.route('/auth', authRoute);

app.route('/users', userRoute);
app.route('/groups', groupRoute);
app.route('/games', gameRoute);
app.route('/stats', statsRoute);

export default app;
