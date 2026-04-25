import { appEntities } from '@/dataSource/entities';
import { DataSource } from 'typeorm';
import fs from 'fs';
import { join } from 'path';

const __dirname = import.meta.dirname;

export const PGAppDataSource = new DataSource({
  type: 'postgres',
  host: 'mahjong-db.cdkierbbje7a.ap-northeast-1.rds.amazonaws.com',
  port: 5432,
  username: 'postgres',
  password: 'sb4pQtaW',
  database: 'mahjong',
  logging: true,
  entities: appEntities,
  migrations: [__dirname + '/migrations/**/*{.js,.ts}'],
  ssl: { ca: fs.readFileSync(join(__dirname, 'ap-northeast-1-bundle.pem')).toString(), rejectUnauthorized: true },
});
