import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @Column('simple-array')
  memberIds!: number[];

  constructor(id: number, name: string, memberIds: number[]) {
    this.id = id;
    this.name = name;
    this.memberIds = memberIds;
  }
}
