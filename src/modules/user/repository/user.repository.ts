import { AppDataSource } from '@/data-source';
import { User } from '@/modules/user/domain/user.entity';
import { txStore } from '@/stores/transaction.store';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(User);

export const userRepository = originalRepository.extend({
  findOne(options: FindOneOptions<User>): Promise<User | null> {
    console.log('Custom findOne method called in userRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(User);
    return repository.findOne(options);
  },
  find(options?: FindManyOptions<User>): Promise<User[]> {
    console.log('Custom find method called in userRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(User);
    return repository.find(options);
  },
});
