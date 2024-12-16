import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddViews1731685899898 implements MigrationInterface {
  name = 'AddViews1731685899898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE VIEW "product_statistics" AS 
        SELECT
            c."categoryName",
            COUNT(p."productId") AS total_products,
            AVG(p.price) AS average_price,
            SUM(p.quantity) AS total_stock
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryName"
    `);
    await queryRunner.query('INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)', ['public', 'VIEW', 'product_statistics', 'SELECT\n            c."categoryName",\n            COUNT(p."productId") AS total_products,\n            AVG(p.price) AS average_price,\n            SUM(p.quantity) AS total_stock\n        FROM products p\n        JOIN category c ON p."categoryId" = c."categoryId"\n        GROUP BY c."categoryName"']);
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
    await queryRunner.query('INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)', ['public', 'VIEW', 'product_feedback_statistics', "SELECT\n            p.\"productName\",\n            COUNT(f.\"feedbackId\") AS total_feedbacks,\n            AVG(f.rate) AS average_rating,\n            STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks\n        FROM products p\n        LEFT JOIN product_feedbacks pf ON p.\"productId\" = pf.\"productProductId\"\n        LEFT JOIN feedbacks f ON pf.\"feedbackFeedbackId\" = f.\"feedbackId\"\n        GROUP BY p.\"productName\""]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3', ['VIEW', 'product_feedback_statistics', 'public']);
    await queryRunner.query('DROP VIEW "product_feedback_statistics"');
    await queryRunner.query('DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3', ['VIEW', 'product_statistics', 'public']);
    await queryRunner.query('DROP VIEW "product_statistics"');
  }
}
