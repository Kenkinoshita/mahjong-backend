import { Score } from '@/modules/game/domain/score.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

type Uma = '10-20' | '10-30';
type Oka = '25000-30000' | '30000-30000';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'ゲームID' })
  id!: number;

  @Column({ type: 'text', name: 'name', comment: 'ゲーム名' })
  name!: string;

  @Column({ type: 'text', name: 'uma', comment: 'ウマ' })
  uma!: Uma;

  @Column({ type: 'text', name: 'oka', comment: 'オカ' })
  oka!: Oka;

  @Column({ type: 'text', name: 'description', comment: '説明文', nullable: true })
  description!: string;

  @Column({ type: 'integer', name: 'group_id', comment: 'グループID' })
  groupId!: number;

  @OneToMany(() => Score, (score) => score.game, { cascade: ['insert', 'update', 'remove'] })
  scores!: Score[];

  @Column({ name: 'played_at', type: 'datetime', comment: 'プレイ日時' })
  playedAt!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '作成日時' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新日時' })
  updatedAt!: Date;

  constructor(id: number, name: string, uma: Uma, oka: Oka, description: string, groupId: number, playedAt: Date) {
    this.id = id;
    this.name = name;
    this.uma = uma;
    this.oka = oka;
    this.description = description;
    this.groupId = groupId;
    this.playedAt = playedAt;
  }
}
