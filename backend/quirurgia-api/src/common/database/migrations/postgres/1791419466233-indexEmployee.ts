import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexEmployee1791419466233 implements MigrationInterface {
    name = 'IndexEmployee1791419466233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_service_code" ON "service"  ("code") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_service_requirement_service_sort_order" ON "service_requirement"  ("service_id", "sort_order") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_service_requirement_service_name" ON "service_requirement"  ("service_id", "name") `);
        await queryRunner.query(`CREATE INDEX "IDX_price_list_resolution" ON "price_lists"  ("status", "branch_id", "patient_category_id", "valid_from", "valid_until", "priority") `);
        await queryRunner.query(`CREATE INDEX "IDX_patient_special_price_resolution" ON "patient_special_price"  ("patient_id", "service_id", "branch_id", "status", "valid_from", "valid_until") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_patient_special_price_resolution"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_price_list_resolution"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_service_requirement_service_name"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_service_requirement_service_sort_order"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_service_code"`);
    }

}
