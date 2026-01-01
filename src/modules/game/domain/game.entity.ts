import { Score } from '@/modules/game/domain/score.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('integer')
  groupId!: number;

  @OneToMany(() => Score, (score) => score.game)
  scores!: Score[];

  constructor(id: number, groupId: number) {
    this.id = id;
    this.groupId = groupId;
  }
}
