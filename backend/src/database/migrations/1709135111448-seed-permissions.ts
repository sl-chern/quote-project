import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1709135111448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO permissions (name) VALUES ('read:posts'), ('write:posts'), ('delete:posts')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "permissions" WHERE 1`);
  }
}
