import { Game } from '@/modules/game/domain/game.entity';
import { Score } from '@/modules/game/domain/score.entity';
import { Group } from '@/modules/group/domain/group.entity';
import { Membership } from '@/modules/group/domain/memberShip.entity';
import { User } from '@/modules/user/domain/user.entity';
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
  entities: [User, Game, Score, Group, Membership],
  ssl: { ca: fs.readFileSync(join(__dirname, 'ap-northeast-1-bundle.pem')).toString(), rejectUnauthorized: true },
});
