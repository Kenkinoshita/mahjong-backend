import { AppDataSource } from '@/dataSource/dataSource.sqlite';
import { Game } from '@/modules/game/domain/game.entity';
import { txStore } from '@/stores/transaction.store';
import { sleep } from '@/utils/sleep';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(Game);

export const gameRepository = originalRepository.extend({
  async findOne(options: FindOneOptions<Game>): Promise<Game | null> {
    await sleep(5);
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Game);
    return await repository.findOne(options);
  },
  async find(options?: FindManyOptions<Game>): Promise<Game[]> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Game);
    return await repository.find(options);
  },
});
