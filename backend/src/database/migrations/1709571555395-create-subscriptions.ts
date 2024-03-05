import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSubscriptions1709571555395 implements MigrationInterface {
    name = 'CreateSubscriptions1709571555395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_subscribers_users" ("usersId_1" uuid NOT NULL, "usersId_2" uuid NOT NULL, CONSTRAINT "PK_13c262ca19a6aac2b2451f9182f" PRIMARY KEY ("usersId_1", "usersId_2"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e42f45eeb15576b5f1c47a4c08" ON "users_subscribers_users" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e0b7ef6c98363b84ccb26211f" ON "users_subscribers_users" ("usersId_2") `);
        await queryRunner.query(`ALTER TABLE "users_subscribers_users" ADD CONSTRAINT "FK_e42f45eeb15576b5f1c47a4c083" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_subscribers_users" ADD CONSTRAINT "FK_5e0b7ef6c98363b84ccb26211fa" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_subscribers_users" DROP CONSTRAINT "FK_5e0b7ef6c98363b84ccb26211fa"`);
        await queryRunner.query(`ALTER TABLE "users_subscribers_users" DROP CONSTRAINT "FK_e42f45eeb15576b5f1c47a4c083"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e0b7ef6c98363b84ccb26211f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e42f45eeb15576b5f1c47a4c08"`);
        await queryRunner.query(`DROP TABLE "users_subscribers_users"`);
    }

}
