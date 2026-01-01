import { AsyncLocalStorage } from 'node:async_hooks';
import type { EntityManager } from 'typeorm';

export type TxStore = {
  manager: EntityManager;
  depth: number; // 任意: ネスト段数などを管理したい場合
};

export const txStore = new AsyncLocalStorage<TxStore>();
