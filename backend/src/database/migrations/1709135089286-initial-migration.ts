import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1709135089286 implements MigrationInterface {
    name = 'InitialMigration1709135089286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "name" character varying, "password" character varying, "is_confirmed" boolean, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_permissions_permissions" ("usersId" uuid NOT NULL, "permissionsId" uuid NOT NULL, CONSTRAINT "PK_b134646ad8acb7a41ef766c4ca3" PRIMARY KEY ("usersId", "permissionsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b70d6dbde0e342b2afd199490c" ON "users_permissions_permissions" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f417b3a2e38339487716aa0742" ON "users_permissions_permissions" ("permissionsId") `);
        await queryRunner.query(`ALTER TABLE "users_permissions_permissions" ADD CONSTRAINT "FK_b70d6dbde0e342b2afd199490cc" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_permissions_permissions" ADD CONSTRAINT "FK_f417b3a2e38339487716aa0742a" FOREIGN KEY ("permissionsId") REFERENCES "permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_permissions_permissions" DROP CONSTRAINT "FK_f417b3a2e38339487716aa0742a"`);
        await queryRunner.query(`ALTER TABLE "users_permissions_permissions" DROP CONSTRAINT "FK_b70d6dbde0e342b2afd199490cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f417b3a2e38339487716aa0742"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b70d6dbde0e342b2afd199490c"`);
        await queryRunner.query(`DROP TABLE "users_permissions_permissions"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
