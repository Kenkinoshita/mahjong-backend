import { Game } from '@/modules/game/domain/game.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('integer')
  userId!: number;

  @Column('integer')
  points!: number;

  @ManyToOne(() => Game, (game) => game.scores)
  game!: Game;

  constructor(id: number, userId: number, points: number, game: Game) {
    this.id = id;
    this.userId = userId;
    this.points = points;
    this.game = game;
  }
}
