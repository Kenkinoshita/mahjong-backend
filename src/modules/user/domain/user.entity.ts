import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'ユーザーID' })
  id!: number;

  @Column({ type: 'text', name: 'name', comment: 'ユーザー名' })
  name!: string;

  @Column({ type: 'text', name: 'email', comment: 'メールアドレス' })
  email!: string;

  @Column({ type: 'text', name: 'password', comment: 'パスワード（ハッシュ化済み）' })
  password!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', comment: '作成日時' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', comment: '更新日時' })
  updatedAt!: Date;

  constructor(id: number, name: string, email: string, password: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
