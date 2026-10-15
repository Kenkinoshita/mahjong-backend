import { describe, expect, it, vi } from 'vitest';
import { EntityManager, Repository, type DataSource } from 'typeorm';
import { withTransaction } from '@/shared/repositories/withTransaction';
import { txStore } from '@/shared/stores/transaction.store';

class TestEntity {
  id!: number;
}

function setup() {
  const connection = { getMetadata: () => ({ target: TestEntity }) } as unknown as DataSource;
  const manager = new EntityManager(connection);
  const transactionManager = new EntityManager(connection);
  const original = new Repository(TestEntity, manager);
  const transactional = new Repository(TestEntity, transactionManager);
  const getRepository = vi.spyOn(transactionManager, 'getRepository').mockReturnValue(transactional);
  const find = vi.spyOn(manager, 'find').mockResolvedValue([{ id: 1 }]);
  const transactionFind = vi.spyOn(transactionManager, 'find').mockResolvedValue([{ id: 2 }]);
  return {
    manager,
    transactionManager,
    find,
    transactionFind,
    getRepository,
    repository: withTransaction(original),
  };
}

describe('withTransaction', () => {
  it('uses the original repository outside a transaction and preserves arguments and this', async () => {
    const { repository, find, transactionFind } = setup();
    const options = { where: { id: 1 } };
    await expect(repository.find(options)).resolves.toEqual([{ id: 1 }]);
    expect(find).toHaveBeenCalledExactlyOnceWith(TestEntity, options);
    expect(transactionFind).not.toHaveBeenCalled();
  });

  it('uses the transactional repository for methods and properties', async () => {
    const { repository, transactionManager, find, transactionFind, getRepository } = setup();
    await txStore.run({ manager: transactionManager, depth: 1 }, async () => {
      expect(repository.manager).toBe(transactionManager);
      await expect(repository.find()).resolves.toEqual([{ id: 2 }]);
    });
    expect(getRepository).toHaveBeenCalledWith(TestEntity);
    expect(transactionFind).toHaveBeenCalledExactlyOnceWith(TestEntity, undefined);
    expect(find).not.toHaveBeenCalled();
  });

  it('resolves the transaction at invocation time and restores the original context', async () => {
    const { repository, transactionManager, manager } = setup();
    // Proxyは取り出したメソッドにも実行時のリポジトリを束縛する。
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const find = repository.find;
    await txStore.run({ manager: transactionManager, depth: 1 }, async () => {
      await expect(find()).resolves.toEqual([{ id: 2 }]);
    });
    expect(repository.manager).toBe(manager);
    await expect(find()).resolves.toEqual([{ id: 1 }]);
  });

  it('propagates errors from the selected repository', async () => {
    const { repository, transactionManager, transactionFind } = setup();
    const error = new Error('Database unavailable');
    transactionFind.mockRejectedValue(error);
    await txStore.run({ manager: transactionManager, depth: 1 }, async () => {
      await expect(repository.find()).rejects.toBe(error);
    });
  });
});
