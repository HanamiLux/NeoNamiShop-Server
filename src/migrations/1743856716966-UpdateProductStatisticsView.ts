import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductStatisticsView1743856716966 implements MigrationInterface {
    name = 'UpdateProductStatisticsView1743856716966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Удалите существующее представление
        await queryRunner.query('DROP VIEW IF EXISTS "product_statistics"');
        await queryRunner.query('DELETE FROM "typeorm_metadata" WHERE "name" = $1', ["product_statistics"]);

        // Создайте новое представление с OR REPLACE
        await queryRunner.query(`
        CREATE OR REPLACE VIEW "product_statistics" AS 
        SELECT
            c."categoryId",
            c."categoryName",
            COUNT(p."productId") as "totalProducts",
            AVG(p.price) as "averagePrice",
            SUM(p.quantity) as "totalStock"
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryId", c."categoryName"
    `);

        // Обновите метаданные TypeORM
        await queryRunner.query(`
        INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") 
        VALUES (DEFAULT, 'public', DEFAULT, 'VIEW', 'product_statistics', $1)
    `, [`
        SELECT
            c."categoryId",
            c."categoryName",
            COUNT(p."productId") as "totalProducts",
            AVG(p.price) as "averagePrice",
            SUM(p.quantity) as "totalStock"
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryId", c."categoryName"
    `]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_feedback_statistics","public"]);
        await queryRunner.query(`DROP VIEW "product_feedback_statistics"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_statistics","public"]);
        await queryRunner.query(`DROP VIEW "product_statistics"`);
        await queryRunner.query(`CREATE VIEW "product_feedback_statistics" AS SELECT
            p."productName",
            COUNT(f."feedbackId") AS total_feedbacks,
            AVG(f.rate) AS average_rating,
            STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks
        FROM products p
        LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
        LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
        GROUP BY p."productName"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_feedback_statistics","SELECT\n            p.\"productName\",\n            COUNT(f.\"feedbackId\") AS total_feedbacks,\n            AVG(f.rate) AS average_rating,\n            STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks\n        FROM products p\n        LEFT JOIN product_feedbacks pf ON p.\"productId\" = pf.\"productProductId\"\n        LEFT JOIN feedbacks f ON pf.\"feedbackFeedbackId\" = f.\"feedbackId\"\n        GROUP BY p.\"productName\""]);
    }

}
