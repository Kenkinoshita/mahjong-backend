import { Membership } from '@/modules/group/domain/memberShip.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('groups')
export class Group {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'グループID' })
  id!: number;

  @Column({ type: 'text', name: 'name', comment: 'グループ名' })
  name!: string;

  @Column({ type: 'text', name: 'description', comment: 'グループ説明文', nullable: true })
  description!: string | null;

  @OneToMany(() => Membership, (membership) => membership.group)
  memberShips!: Membership[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone', comment: '作成日時' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone', comment: '更新日時' })
  updatedAt!: Date;

  constructor(id: number, name: string, memberShips: Membership[]) {
    this.id = id;
    this.name = name;
    this.memberShips = memberShips;
  }
}
