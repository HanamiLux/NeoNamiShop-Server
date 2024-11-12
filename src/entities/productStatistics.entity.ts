import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('product_statistics')
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