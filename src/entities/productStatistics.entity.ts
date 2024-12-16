import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
        SELECT
            c."categoryName",
            COUNT(p."productId") AS total_products,
            AVG(p.price) AS average_price,
            SUM(p.quantity) AS total_stock
        FROM products p
        JOIN category c ON p."categoryId" = c."categoryId"
        GROUP BY c."categoryName"
    `,
})
export class ProductStatistics {
    @ViewColumn()
      categoryName: string;

    @ViewColumn()
      totalProducts: number;

    @ViewColumn()
      averagePrice: number;

    @ViewColumn()
      totalStock: number;
}
