import { Game } from '@/modules/game/domain/game.entity';
import { Score } from '@/modules/game/domain/score.entity';
import { Group } from '@/modules/group/domain/group.entity';
import { Membership } from '@/modules/group/domain/memberShip.entity';
import { User } from '@/modules/user/domain/user.entity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  logging: true,
  entities: [User, Game, Score, Group, Membership],
});
