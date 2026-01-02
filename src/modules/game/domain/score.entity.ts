import { Game } from '@/modules/game/domain/game.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('scores')
export class Score {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'スコアID' })
  id!: number;

  @Column({ type: 'integer', name: 'user_id', comment: 'ユーザーID' })
  userId!: number;

  @Column({ type: 'integer', name: 'point', comment: 'ポイント' })
  point!: number;

  @ManyToOne(() => Game, (game) => game.scores, { nullable: false })
  @JoinColumn([{ name: 'game_id', referencedColumnName: 'id' }])
  game!: Game;

  constructor(id: number, userId: number, point: number, game: Game) {
    this.id = id;
    this.userId = userId;
    this.point = point;
    this.game = game;
  }
}
