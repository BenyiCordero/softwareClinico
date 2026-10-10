import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexArea1791246969674 implements MigrationInterface {
  name = 'IndexArea1791246969674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_branch_code" ON "branch"  ("code") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_area_branch_parent_name" ON "area"  ("branch_id", "parent_area_id", "name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_consulting_room_branch_code" ON "consulting_room"  ("branch_id", "code") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_consulting_room_branch_code"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_area_branch_parent_name"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_branch_code"`);
  }
}
