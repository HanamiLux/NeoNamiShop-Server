import { MigrationInterface, QueryRunner } from "typeorm";

export class LogEntityUpdate1730727558538 implements MigrationInterface {
    name = 'LogEntityUpdate1730727558538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_feedback_product"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_category"`);
        await queryRunner.query(`DROP INDEX "public"."idx_product_price"`);
        await queryRunner.query(`ALTER TABLE "logs" ADD "type" character varying(20) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "logs" DROP COLUMN "type"`);
        await queryRunner.query(`CREATE INDEX "idx_product_price" ON "products" ("price") `);
        await queryRunner.query(`CREATE INDEX "idx_product_category" ON "products" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "idx_feedback_product" ON "feedbacks" ("productId") `);
    }

}
