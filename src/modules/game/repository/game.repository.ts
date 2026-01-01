import { AppDataSource } from '@/data-source';
import { Game } from '@/modules/game/domain/game.entity';
import { txStore } from '@/stores/transaction.store';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(Game);

export const gameRepository = originalRepository.extend({
  findOne(options: FindOneOptions<Game>): Promise<Game | null> {
    console.log('Custom findOne method called in gameRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Game);
    return repository.findOne(options);
  },
  find(options?: FindManyOptions<Game>): Promise<Game[]> {
    console.log('Custom find method called in gameRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Game);
    return repository.find(options);
  },
});
