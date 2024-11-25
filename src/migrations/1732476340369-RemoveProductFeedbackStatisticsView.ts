import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveProductFeedbackStatisticsView1732476340369 implements MigrationInterface {
    name = 'RemoveProductFeedbackStatisticsView1732476340369';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Удалить запись о представлении из typeorm_metadata
        await queryRunner.query(
            `DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`,
            ["VIEW", "product_feedback_statistics", "public"]
        );
        // Удалить представление, если оно существует
        await queryRunner.query(`DROP VIEW IF EXISTS "product_feedback_statistics"`);
        await queryRunner.query(`DROP TABLE "product_feedbacks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_feedbacks" ("id" SERIAL NOT NULL, "productProductId" integer, "feedbackFeedbackId" integer, CONSTRAINT "PK_137209d7e486adfc8b85688b4c5" PRIMARY KEY ("id"))`);
        // Восстановить представление
        await queryRunner.query(`CREATE VIEW "product_feedback_statistics" AS 
        SELECT
            p."productName",
            COUNT(f."feedbackId") AS total_feedbacks,
            AVG(f.rate) AS average_rating,
            STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks
        FROM products p
        LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
        LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
        GROUP BY p."productName"
        `);

        // Восстановить запись в typeorm_metadata
        await queryRunner.query(
            `INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") 
            VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`,
            [
                "public",
                "VIEW",
                "product_feedback_statistics",
                `SELECT
                    p."productName",
                    COUNT(f."feedbackId") AS total_feedbacks,
                    AVG(f.rate) AS average_rating,
                    STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks
                FROM products p
                LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
                LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
                GROUP BY p."productName"`
            ]
        );
    }
}
