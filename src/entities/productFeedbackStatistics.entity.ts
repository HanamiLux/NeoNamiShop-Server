import {ViewColumn, ViewEntity} from "typeorm";

@ViewEntity('product_feedback_statistics')
export class ProductFeedbackStatistics {
    @ViewColumn()
    productName: string;
    @ViewColumn()
    totalFeedbacks: number;
    @ViewColumn()
    averageRating: number;
    @ViewColumn()
    recentFeedbacks: string;
}