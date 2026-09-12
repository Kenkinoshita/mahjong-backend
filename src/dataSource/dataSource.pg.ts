import { appEntities } from '@/dataSource/entities';
import { DataSource } from 'typeorm';
import { env } from '@/shared/configs/env';

const __dirname = import.meta.dirname;

export const PGAppDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  logging: true,
  entities: appEntities,
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
});
