import { appEntities } from '@/dataSource/entities';
import { DataSource } from 'typeorm';

const __dirname = import.meta.dirname;

export const SQLiteAppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  logging: true,
  entities: appEntities,
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
});
