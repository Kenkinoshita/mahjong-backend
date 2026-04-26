import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1777193038928 implements MigrationInterface {
  name = 'Initial1777193038928';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scores" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "point" integer NOT NULL, "game_id" integer NOT NULL, CONSTRAINT "PK_c36917e6f26293b91d04b8fd521" PRIMARY KEY ("id")); COMMENT ON COLUMN "scores"."id" IS 'スコアID'; COMMENT ON COLUMN "scores"."user_id" IS 'ユーザーID'; COMMENT ON COLUMN "scores"."point" IS 'ポイント'; COMMENT ON COLUMN "scores"."game_id" IS 'ゲームID'`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" SERIAL NOT NULL, "name" text NOT NULL, "uma" text NOT NULL, "oka" text NOT NULL, "description" text, "group_id" integer NOT NULL, "played_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id")); COMMENT ON COLUMN "games"."id" IS 'ゲームID'; COMMENT ON COLUMN "games"."name" IS 'ゲーム名'; COMMENT ON COLUMN "games"."uma" IS 'ウマ'; COMMENT ON COLUMN "games"."oka" IS 'オカ'; COMMENT ON COLUMN "games"."description" IS '説明文'; COMMENT ON COLUMN "games"."group_id" IS 'グループID'; COMMENT ON COLUMN "games"."played_at" IS 'プレイ日時'; COMMENT ON COLUMN "games"."created_at" IS '作成日時'; COMMENT ON COLUMN "games"."updated_at" IS '更新日時'`,
    );
    await queryRunner.query(
      `CREATE TABLE "memberships" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "registered_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group_id" integer NOT NULL, CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"), CONSTRAINT "PK_25d28bd932097a9e90495ede7b4" PRIMARY KEY ("id")); COMMENT ON COLUMN "memberships"."id" IS 'メンバーシップID'; COMMENT ON COLUMN "memberships"."user_id" IS 'ユーザーID'; COMMENT ON COLUMN "memberships"."registered_at" IS '登録日時'; COMMENT ON COLUMN "memberships"."group_id" IS 'グループID'`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id") `);
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id")); COMMENT ON COLUMN "groups"."id" IS 'グループID'; COMMENT ON COLUMN "groups"."name" IS 'グループ名'; COMMENT ON COLUMN "groups"."description" IS 'グループ説明文'; COMMENT ON COLUMN "groups"."created_at" IS '作成日時'; COMMENT ON COLUMN "groups"."updated_at" IS '更新日時'`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."id" IS 'ユーザーID'; COMMENT ON COLUMN "users"."name" IS 'ユーザー名'; COMMENT ON COLUMN "users"."email" IS 'メールアドレス'; COMMENT ON COLUMN "users"."password" IS 'パスワード（ハッシュ化済み）'; COMMENT ON COLUMN "users"."created_at" IS '作成日時'; COMMENT ON COLUMN "users"."updated_at" IS '更新日時'`,
    );
    await queryRunner.query(
      `ALTER TABLE "scores" ADD CONSTRAINT "FK_556372ad7a13fdae500775f8789" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" ADD CONSTRAINT "FK_253a15e6c430fc2e5bb84c4afda" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "memberships" DROP CONSTRAINT "FK_253a15e6c430fc2e5bb84c4afda"`);
    await queryRunner.query(`ALTER TABLE "scores" DROP CONSTRAINT "FK_556372ad7a13fdae500775f8789"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_membership_group"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_membership_user"`);
    await queryRunner.query(`DROP TABLE "memberships"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "scores"`);
  }
}
