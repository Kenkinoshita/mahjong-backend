import { Group } from '@/modules/group/domain/group.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('memberships')
@Unique('UQ_membership_group_user', ['group_id', 'user_id'])
@Index('IDX_membership_group', ['group_id'])
@Index('IDX_membership_user', ['user_id'])
export class Membership {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'メンバーシップID' })
  id!: number;

  // Groupは同一集約のためリレーションを貼る（FKはgroup_id）
  @ManyToOne(() => Group, (group) => group.memberShips)
  @JoinColumn({ name: 'group_id', referencedColumnName: 'id' })
  group!: Group;

  // Userは別集約のため、Userエンティティへのリレーションは貼らずID参照のみ
  @Column({ type: 'integer', name: 'user_id', comment: 'ユーザーID' })
  userId!: number;

  @CreateDateColumn({ name: 'registered_at', type: 'timestamp with time zone', comment: '登録日時' })
  registeredAt!: Date;

  constructor(id: number, group: Group, userId: number) {
    this.id = id;
    this.group = group;
    this.userId = userId;
  }
}
