import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQuoteTable1709571277295 implements MigrationInterface {
    name = 'CreateQuoteTable1709571277295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quotes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "text" character varying NOT NULL, "history" character varying NOT NULL, "authorId" uuid, CONSTRAINT "PK_99a0e8bcbcd8719d3a41f23c263" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quotes" ADD CONSTRAINT "FK_7da9efd0f2925f08e59dcb2b8fe" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quotes" DROP CONSTRAINT "FK_7da9efd0f2925f08e59dcb2b8fe"`);
        await queryRunner.query(`DROP TABLE "quotes"`);
    }

}
