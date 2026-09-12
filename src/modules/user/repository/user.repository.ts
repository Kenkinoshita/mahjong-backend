import { AppDataSource } from '@/dataSource';
import { User } from '@/modules/user/domain/user.entity';
import { txStore } from '@/shared/stores/transaction.store';
import type { FindManyOptions, FindOneOptions, SaveOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(User);

export const userRepository = originalRepository.extend({
  async save(user: User, options?: SaveOptions): Promise<User> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(User);
    return await repository.save(user, options);
  },
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
