import { AppDataSource } from '@/dataSource';
import { Game } from '@/modules/game/domain/game.entity';
import { withTransaction } from '@/shared/repositories/withTransaction';

export const gameRepository = withTransaction(AppDataSource.getRepository(Game));
