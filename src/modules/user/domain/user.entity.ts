import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';

@Entity('users')
@Unique('UQ_users_email', ['email'])
export class User {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id', comment: 'ユーザーID' })
  id!: number;

  @Column({ type: 'text', name: 'name', comment: 'ユーザー名' })
  name!: string;

  @Column({ type: 'text', name: 'email', comment: 'メールアドレス' })
  email!: string;

  @Column({ type: 'text', name: 'password', comment: 'パスワード（ハッシュ化済み）' })
  password!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz', comment: '作成日時' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', comment: '更新日時' })
  updatedAt!: Date;

  private constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static create({ name, email, password }: { name: string; email: string; password: string }): User {
    return new User(name, email, password);
  }
}
