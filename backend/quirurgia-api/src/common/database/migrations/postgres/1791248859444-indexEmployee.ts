import { MigrationInterface, QueryRunner } from 'typeorm';

export class IndexEmployee1791248859444 implements MigrationInterface {
  name = 'IndexEmployee1791248859444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_person_rfc" ON "person"  ("rfc") WHERE "rfc" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_person_curp" ON "person"  ("curp") WHERE "curp" IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_employee_number" ON "employee"  ("employee_number") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_employee_person" ON "employee"  ("person_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_employee_assignment_primary_active" ON "employee_assignment"  ("employee_id") WHERE "assignment_type" = 'PRIMARY' AND "status" = 'ACTIVE'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_health_professional_license" ON "health_professional"  ("professional_license") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_health_professional_employee" ON "health_professional"  ("employee_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_professional_specialty_primary" ON "professional_specialties"  ("health_professional_id") WHERE "priority" = 'PRIMARY'`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_professional_specialty_pair" ON "professional_specialties"  ("health_professional_id", "specialty_id") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_professional_specialty_pair"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_professional_specialty_primary"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_health_professional_employee"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_health_professional_license"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."UQ_employee_assignment_primary_active"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_employee_person"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_employee_number"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_person_curp"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_person_rfc"`);
  }
}
