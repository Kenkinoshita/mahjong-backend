import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKeys1767349000000 implements MigrationInterface {
  name = 'AddForeignKeys1767349000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // games.group_id -> groups.id
    await queryRunner.query(`ALTER TABLE "games" RENAME TO "temporary_games"`);
    await queryRunner.query(
      `CREATE TABLE "games" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" text NOT NULL,
        "uma" text NOT NULL,
        "oka" text NOT NULL,
        "description" text,
        "group_id" integer NOT NULL,
        "played_at" datetime NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_games_group" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "games"("id", "name", "uma", "oka", "description", "group_id", "played_at", "created_at", "updated_at")
       SELECT "id", "name", "uma", "oka", "description", "group_id", "played_at", "created_at", "updated_at" FROM "temporary_games"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_games"`);

    // memberships.user_id -> users.id
    // 既存の groups FK と unique / index は保持しつつ user FK を追加
    await queryRunner.query(`DROP INDEX "IDX_membership_user"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_group"`);
    await queryRunner.query(`ALTER TABLE "memberships" RENAME TO "temporary_memberships"`);
    await queryRunner.query(
      `CREATE TABLE "memberships" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "user_id" integer NOT NULL,
        "registered_at" datetime NOT NULL DEFAULT (datetime('now')),
        "group_id" integer NOT NULL,
        CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"),
        CONSTRAINT "FK_253a15e6c430fc2e5bb84c4afda" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_memberships_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "memberships"("id", "user_id", "registered_at", "group_id")
       SELECT "id", "user_id", "registered_at", "group_id" FROM "temporary_memberships"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_memberships"`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id")`);

    // scores.user_id -> users.id
    // 既存の games FK は保持しつつ user FK を追加
    await queryRunner.query(`ALTER TABLE "scores" RENAME TO "temporary_scores"`);
    await queryRunner.query(
      `CREATE TABLE "scores" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "user_id" integer NOT NULL,
        "point" integer NOT NULL,
        "game_id" integer NOT NULL,
        CONSTRAINT "FK_556372ad7a13fdae500775f8789" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_scores_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "scores"("id", "user_id", "point", "game_id")
       SELECT "id", "user_id", "point", "game_id" FROM "temporary_scores"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_scores"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // scores: user FKのみ削除（games FKは維持）
    await queryRunner.query(`ALTER TABLE "scores" RENAME TO "temporary_scores"`);
    await queryRunner.query(
      `CREATE TABLE "scores" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "user_id" integer NOT NULL,
        "point" integer NOT NULL,
        "game_id" integer NOT NULL,
        CONSTRAINT "FK_556372ad7a13fdae500775f8789" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "scores"("id", "user_id", "point", "game_id")
       SELECT "id", "user_id", "point", "game_id" FROM "temporary_scores"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_scores"`);

    // memberships: user FKのみ削除（groups FK・unique・indexは維持）
    await queryRunner.query(`DROP INDEX "IDX_membership_user"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_group"`);
    await queryRunner.query(`ALTER TABLE "memberships" RENAME TO "temporary_memberships"`);
    await queryRunner.query(
      `CREATE TABLE "memberships" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "user_id" integer NOT NULL,
        "registered_at" datetime NOT NULL DEFAULT (datetime('now')),
        "group_id" integer NOT NULL,
        CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"),
        CONSTRAINT "FK_253a15e6c430fc2e5bb84c4afda" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "memberships"("id", "user_id", "registered_at", "group_id")
       SELECT "id", "user_id", "registered_at", "group_id" FROM "temporary_memberships"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_memberships"`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id")`);

    // games: group FK削除
    await queryRunner.query(`ALTER TABLE "games" RENAME TO "temporary_games"`);
    await queryRunner.query(
      `CREATE TABLE "games" (
        "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        "name" text NOT NULL,
        "uma" text NOT NULL,
        "oka" text NOT NULL,
        "description" text,
        "group_id" integer NOT NULL,
        "played_at" datetime NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        "updated_at" datetime NOT NULL DEFAULT (datetime('now'))
      )`,
    );
    await queryRunner.query(
      `INSERT INTO "games"("id", "name", "uma", "oka", "description", "group_id", "played_at", "created_at", "updated_at")
       SELECT "id", "name", "uma", "oka", "description", "group_id", "played_at", "created_at", "updated_at" FROM "temporary_games"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_games"`);
  }
}
