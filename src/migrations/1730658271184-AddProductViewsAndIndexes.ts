import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProductViewsAndIndexes1699021234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создание представлений
        await queryRunner.query(`
            CREATE OR REPLACE VIEW product_statistics AS
            SELECT 
                c."categoryName",
                COUNT(p."productId") as total_products,
                AVG(p.price) as average_price,
                SUM(p.quantity) as total_stock
            FROM products p
            JOIN category c ON p."categoryId" = c."categoryId"
            GROUP BY c."categoryName"
        `);

        await queryRunner.query(`
            CREATE OR REPLACE VIEW product_feedback_statistics AS
            SELECT 
                p."productName",
                COUNT(f."feedbackId") as total_feedbacks,
                AVG(f.rate) as average_rating,
                STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) as recent_feedbacks
            FROM products p
            LEFT JOIN (
                SELECT * FROM feedbacks ORDER BY date DESC LIMIT 3
            ) f ON p."productId" = f."productId"
            GROUP BY p."productName"
        `);

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
                    COUNT(DISTINCT f."feedbackId") as total_feedbacks,
                    COALESCE(AVG(f.rate), 0) as average_rating,
                    COUNT(DISTINCT o."orderId") as total_orders,
                    p.quantity as stock_level
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
        await queryRunner.query(`CREATE OR REPLACE PROCEDURE add_feedback(
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
                        $$;`);

        // Создание индексов
        await queryRunner.query(`CREATE INDEX idx_product_category ON products("categoryId")`);
        await queryRunner.query(`CREATE INDEX idx_product_price ON products(price)`);
        await queryRunner.query(`CREATE INDEX idx_feedback_product ON feedbacks("productId")`);
        await queryRunner.query(`CREATE INDEX idx_product_name_search ON products USING gin(to_tsvector('english', "productName"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Удаление индексов
        await queryRunner.query(`DROP INDEX IF EXISTS idx_product_category`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_product_price`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_feedback_product`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_product_name_search`);

        // Удаление функции
        await queryRunner.query(`DROP FUNCTION IF EXISTS get_product_full_statistics`);
        // Удаление процедуры
        await queryRunner.query(`DROP PROCEDURE IF EXISTS add_feedback`);
        // Удаление представлений
        await queryRunner.query(`DROP VIEW IF EXISTS product_feedback_statistics`);
        await queryRunner.query(`DROP VIEW IF EXISTS product_statistics`);
    }
}