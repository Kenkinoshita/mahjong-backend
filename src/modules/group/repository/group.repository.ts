import { AppDataSource } from '@/data-source';
import { Group } from '@/modules/group/domain/group.entity';
import { txStore } from '@/stores/transaction.store';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(Group);

export const groupRepository = originalRepository.extend({
  findOne(options: FindOneOptions<Group>): Promise<Group | null> {
    console.log('Custom findOne method called in groupRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Group);
    return repository.findOne(options);
  },
  find(options?: FindManyOptions<Group>): Promise<Group[]> {
    console.log('Custom find method called in groupRepository');
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Group);
    return repository.find(options);
  },
});
