import { User } from '@/entity/User';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [User],
});
