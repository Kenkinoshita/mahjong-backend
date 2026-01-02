import type { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1767344676402 implements MigrationInterface {
  name = 'Initial1767344676402';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "scores" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "point" integer NOT NULL, "game_id" integer NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "games" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "uma" text NOT NULL, "oka" text NOT NULL, "description" text, "group_id" integer NOT NULL, "played_at" datetime NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "memberships" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "registered_at" datetime NOT NULL DEFAULT (datetime('now')), "group_id" integer NOT NULL, CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id") `);
    await queryRunner.query(
      `CREATE TABLE "groups" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "description" text, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_scores" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "point" integer NOT NULL, "game_id" integer NOT NULL, CONSTRAINT "FK_556372ad7a13fdae500775f8789" FOREIGN KEY ("game_id") REFERENCES "games" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_scores"("id", "user_id", "point", "game_id") SELECT "id", "user_id", "point", "game_id" FROM "scores"`,
    );
    await queryRunner.query(`DROP TABLE "scores"`);
    await queryRunner.query(`ALTER TABLE "temporary_scores" RENAME TO "scores"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_user"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_group"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_memberships" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "registered_at" datetime NOT NULL DEFAULT (datetime('now')), "group_id" integer NOT NULL, CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"), CONSTRAINT "FK_253a15e6c430fc2e5bb84c4afda" FOREIGN KEY ("group_id") REFERENCES "groups" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_memberships"("id", "user_id", "registered_at", "group_id") SELECT "id", "user_id", "registered_at", "group_id" FROM "memberships"`,
    );
    await queryRunner.query(`DROP TABLE "memberships"`);
    await queryRunner.query(`ALTER TABLE "temporary_memberships" RENAME TO "memberships"`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id") `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_membership_group"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_user"`);
    await queryRunner.query(`ALTER TABLE "memberships" RENAME TO "temporary_memberships"`);
    await queryRunner.query(
      `CREATE TABLE "memberships" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "registered_at" datetime NOT NULL DEFAULT (datetime('now')), "group_id" integer NOT NULL, CONSTRAINT "UQ_membership_group_user" UNIQUE ("group_id", "user_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO "memberships"("id", "user_id", "registered_at", "group_id") SELECT "id", "user_id", "registered_at", "group_id" FROM "temporary_memberships"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_memberships"`);
    await queryRunner.query(`CREATE INDEX "IDX_membership_group" ON "memberships" ("group_id") `);
    await queryRunner.query(`CREATE INDEX "IDX_membership_user" ON "memberships" ("user_id") `);
    await queryRunner.query(`ALTER TABLE "scores" RENAME TO "temporary_scores"`);
    await queryRunner.query(
      `CREATE TABLE "scores" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "user_id" integer NOT NULL, "point" integer NOT NULL, "game_id" integer NOT NULL)`,
    );
    await queryRunner.query(
      `INSERT INTO "scores"("id", "user_id", "point", "game_id") SELECT "id", "user_id", "point", "game_id" FROM "temporary_scores"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_scores"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "groups"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_group"`);
    await queryRunner.query(`DROP INDEX "IDX_membership_user"`);
    await queryRunner.query(`DROP TABLE "memberships"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "scores"`);
  }
}
