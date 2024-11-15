import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
    expression: `
        SELECT
            p."productName",
            COUNT(f."feedbackId") AS total_feedbacks,
            AVG(f.rate) AS average_rating,
            STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS recent_feedbacks
        FROM products p
        LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
        LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
        GROUP BY p."productName"
    `
})
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