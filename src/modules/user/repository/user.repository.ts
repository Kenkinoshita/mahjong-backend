import { AppDataSource } from '@/dataSource/dataSource.sqlite';
import { User } from '@/modules/user/domain/user.entity';
import { txStore } from '@/stores/transaction.store';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(User);

export const userRepository = originalRepository.extend({
  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(User);
    return await repository.findOne(options);
  },
  async find(options?: FindManyOptions<User>): Promise<User[]> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(User);
    return await repository.find(options);
  },
});
