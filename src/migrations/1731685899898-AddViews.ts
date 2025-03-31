import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddViews1731685899898 implements MigrationInterface {
  name = 'AddViews1731685899898';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                  CREATE OR REPLACE VIEW product_statistics AS
        SELECT
            c."categoryId"::integer,
            c."categoryName"::varchar,
            COUNT(p."productId")::integer AS "totalProducts",
            AVG(p.price)::numeric(10,2) AS "averagePrice",
            SUM(p.quantity)::integer AS "totalStock"
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryId", c."categoryName";
    `);

    await queryRunner.query(`
        CREATE VIEW "product_feedback_statistics" AS 
            SELECT
                p."productId",
                p."productName",
                COUNT(f."feedbackId") AS total_feedbacks,
                COALESCE(AVG(f.rate), 0) AS average_rating
            FROM products p
            LEFT JOIN feedbacks f ON p."productId" = f."productId"
            GROUP BY p."productId", p."productName"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3', ['VIEW', 'product_feedback_statistics', 'public']);
    await queryRunner.query('DROP VIEW "product_feedback_statistics"');
    await queryRunner.query('DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3', ['VIEW', 'product_statistics', 'public']);
    await queryRunner.query('DROP VIEW "product_statistics"');
  }
}
