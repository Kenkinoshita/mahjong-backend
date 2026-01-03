import { AppDataSource } from '@/dataSource/dataSource.sqlite';
import type { TxStore } from '@/shared/stores/transaction.store';
import { txStore } from '@/shared/stores/transaction.store';
import type { FunctionLike } from '@/shared/types/utilityTypes';
import type { EntityManager } from 'typeorm';

type Propagation = 'REQUIRED' | 'REQUIRES_NEW';

export function Transactional(opts?: { propagation?: Propagation }) {
  const propagation = opts?.propagation ?? 'REQUIRED';

  return function (_target: unknown, _propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value as FunctionLike;

    descriptor.value = async function (...args: unknown[]) {
      const existing = txStore.getStore();

      // REQUIRED: 既にTxがあればそれに参加（同一Tx）
      if (propagation === 'REQUIRED' && existing?.manager) {
        // ネスト段数を増やしたいなら run し直して depth を更新してもOK
        return original.apply(this, args) as Promise<unknown>;
      }

      // REQUIRES_NEW: 常に新しいTx（既存Txがあっても別Txにする）
      // REQUIRED で既存Txが無い場合もここに来る
      return AppDataSource.transaction(async (manager: EntityManager) => {
        const store: TxStore = { manager, depth: (existing?.depth ?? 0) + 1 };

        // ALS でこの transaction の manager をスコープに流す
        return txStore.run(store, async () => {
          return original.apply(this, args) as Promise<unknown>;
        });
      });
    };

    return descriptor;
  };
}
