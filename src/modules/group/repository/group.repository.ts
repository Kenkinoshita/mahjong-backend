import { AppDataSource } from '@/dataSource/dataSource.sqlite';
import { Group } from '@/modules/group/domain/group.entity';
import { txStore } from '@/stores/transaction.store';
import type { FindManyOptions, FindOneOptions } from 'typeorm';

const originalRepository = AppDataSource.getRepository(Group);

export const groupRepository = originalRepository.extend({
  async findOne(options: FindOneOptions<Group>): Promise<Group | null> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Group);
    return await repository.findOne(options);
  },
  async find(options?: FindManyOptions<Group>): Promise<Group[]> {
    const manager = txStore.getStore()?.manager;
    const repository = !manager ? originalRepository : manager.getRepository(Group);
    return await repository.find(options);
  },
});
