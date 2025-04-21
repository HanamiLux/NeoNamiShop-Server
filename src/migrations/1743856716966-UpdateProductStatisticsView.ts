import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProductStatisticsView1743856716966 implements MigrationInterface {
    name = 'UpdateProductStatisticsView1743856716966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","product_feedback_statistics","public"]);
        await queryRunner.query(`DROP VIEW "product_feedback_statistics"`);
        await queryRunner.query(`CREATE VIEW "product_statistics" AS 
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
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_statistics","SELECT\n            c.\"categoryId\",\n            c.\"categoryName\",\n            COUNT(p.\"productId\") as \"totalProducts\",\n            AVG(p.price) as \"averagePrice\",\n            SUM(p.quantity) as \"totalStock\"\n        FROM products p\n        JOIN category c ON p.\"categoryId\" = c.\"categoryId\"\n        GROUP BY c.\"categoryId\", c.\"categoryName\""]);
        await queryRunner.query(`CREATE VIEW "product_feedback_statistics" AS 
    SELECT
        p."productId",
        p."productName",
        COUNT(f."feedbackId") AS "totalFeedbacks",
        AVG(f.rate) AS "averageRating",
        STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS "recentFeedbacks"
    FROM products p
    LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
    LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
    GROUP BY p."productId", p."productName"
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","product_feedback_statistics","SELECT\n        p.\"productId\",\n        p.\"productName\",\n        COUNT(f.\"feedbackId\") AS \"totalFeedbacks\",\n        AVG(f.rate) AS \"averageRating\",\n        STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS \"recentFeedbacks\"\n    FROM products p\n    LEFT JOIN product_feedbacks pf ON p.\"productId\" = pf.\"productProductId\"\n    LEFT JOIN feedbacks f ON pf.\"feedbackFeedbackId\" = f.\"feedbackId\"\n    GROUP BY p.\"productId\", p.\"productName\""]);
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
