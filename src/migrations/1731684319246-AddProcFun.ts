import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProcFun1731684319246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Создание функции
    await queryRunner.query(`
            CREATE OR REPLACE FUNCTION get_product_full_statistics(product_id INT)
            RETURNS TABLE (
                product_name VARCHAR,
                category_name VARCHAR,
                total_feedbacks INT,
                average_rating DECIMAL,
                total_orders INT,
                stock_level INT
            ) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    p."productName",
                    c."categoryName",
                    COUNT(DISTINCT f."feedbackId") AS total_feedbacks,
                    COALESCE(AVG(f.rate), 0) AS average_rating,
                    COUNT(DISTINCT o."orderId") AS total_orders,
                    p.quantity AS stock_level
                FROM products p
                LEFT JOIN category c ON p."categoryId" = c."categoryId"
                LEFT JOIN feedbacks f ON p."productId" = f."productId"
                LEFT JOIN ordered_products op ON p."productId" = op."productId"
                LEFT JOIN orders o ON op."orderId" = o."orderId"
                WHERE p."productId" = product_id
                GROUP BY p."productName", c."categoryName", p.quantity;
            END;
            $$ LANGUAGE plpgsql;
        `);

    // Создание процедуры
    await queryRunner.query(`
            CREATE OR REPLACE PROCEDURE add_feedback(
                product_id INT,
                rate DECIMAL,
                content TEXT
            )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                INSERT INTO feedbacks ("productId", rate, content, date)
                VALUES (product_id, rate, content, NOW());

                -- Обновление среднего рейтинга и количества отзывов
                UPDATE products
                SET average_rating = (
                    SELECT AVG(rate) FROM feedbacks WHERE "productId" = product_id
                ),
                total_feedbacks = (
                    SELECT COUNT(*) FROM feedbacks WHERE "productId" = product_id
                )
                WHERE "productId" = product_id;
            END;
            $$;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Удаление функции
    await queryRunner.query('DROP FUNCTION IF EXISTS get_product_full_statistics(INT);');

    // Удаление процедуры
    await queryRunner.query('DROP PROCEDURE IF EXISTS add_feedback(INT, DECIMAL, TEXT);');
  }
}
