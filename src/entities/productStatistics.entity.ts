import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'product_statistics',
    expression: `
        SELECT
            c."categoryId",
            c."categoryName",
            COUNT(p."productId") as "totalProducts",
            AVG(p.price) as "averagePrice",
            SUM(p.quantity) as "totalStock"
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryId", c."categoryName"
    `
})
export class ProductStatistics {
    @ViewColumn() categoryId: number;
    @ViewColumn() categoryName: string;
    @ViewColumn() totalProducts: number;
    @ViewColumn() averagePrice: number;
    @ViewColumn() totalStock: number;
}