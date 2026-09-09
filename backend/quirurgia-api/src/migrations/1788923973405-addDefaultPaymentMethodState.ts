import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultPaymentMethodState1788923973405 implements MigrationInterface {
    name = 'AddDefaultPaymentMethodState1788923973405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_method" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_method" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
