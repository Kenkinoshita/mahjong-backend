import type { ObjectLiteral, Repository } from 'typeorm';
import { txStore } from '@/shared/stores/transaction.store';

export function withTransaction<T extends ObjectLiteral>(originalRepository: Repository<T>): Repository<T> {
  const resolveRepository = (): Repository<T> => {
    const manager = txStore.getStore()?.manager;
    return manager ? manager.getRepository(originalRepository.target) : originalRepository;
  };

  return new Proxy(originalRepository, {
    get(_target, property) {
      const repository = resolveRepository();
      const value: unknown = Reflect.get(repository, property, repository);
      if (typeof value !== 'function') return value;

      return (...args: unknown[]) => {
        // メソッドを取り出してから呼び出す場合も、実行時のトランザクションを使用する。
        const currentRepository = resolveRepository();
        const method = Reflect.get(currentRepository, property, currentRepository) as typeof value;
        return Reflect.apply(method, currentRepository, args) as unknown;
      };
    },
  });
}
