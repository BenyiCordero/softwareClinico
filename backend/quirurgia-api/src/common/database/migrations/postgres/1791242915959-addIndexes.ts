import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIndexes1791242915959 implements MigrationInterface {
  name = 'AddIndexes1791242915959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."UQ_resource_action"`);
    await queryRunner.query(
      `ALTER TYPE "public"."permission_action_enum" ADD VALUE 'delete'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_resource_action" ON "permission"  ("resource", "action") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_position_name" ON "position"  ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_patient_category_name" ON "patient_category"  ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_specialty_name" ON "specialty"  ("name") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_service_category_parent_name" ON "service_category"  ("parent_category_id", "name") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_service_category_parent_name"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_specialty_name"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_patient_category_name"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_position_name"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_resource_action"`);
    await queryRunner.query(
      `CREATE TYPE "public"."permission_action_enum_old" AS ENUM('create', 'read', 'update', 'archive', 'assign', 'unassign', 'revoke', 'approve', 'export', 'change_password', 'manage_permissions', 'cancel', 'void', 'activate', 'deactivate', 'confirm', 'check_in', 'start', 'complete', 'reschedule', 'mark_no_show', 'amend', 'restrict', 'unrestrict', 'close', 'reopen', 'refund', 'publish', 'unpublish', 'block', 'unblock', 'manage_roles', 'manage_overrides', 'upload', 'download', 'revoke_session')`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ALTER COLUMN "action" TYPE "public"."permission_action_enum_old" USING "action"::"text"::"public"."permission_action_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."permission_action_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."permission_action_enum_old" RENAME TO "permission_action_enum"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_resource_action" ON "permission" USING btree ("action", "resource") `,
    );
  }
}
