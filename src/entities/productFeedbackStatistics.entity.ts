import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
    name: 'product_feedback_statistics',
    expression: `
    SELECT
        p."productId",
        p."productName",
        COUNT(f."feedbackId") AS "totalFeedbacks",
        AVG(f.rate) AS "averageRating",
        STRING_AGG(f.content, ' | ' ORDER BY f.date DESC) AS "recentFeedbacks"
    FROM products p
    LEFT JOIN product_feedbacks pf ON p."productId" = pf."productProductId"
    LEFT JOIN feedbacks f ON pf."feedbackFeedbackId" = f."feedbackId"
    GROUP BY p."productId", p."productName"
  `,
})
export class ProductFeedbackStatistics {
    @ViewColumn()
    productId: number;

    @ViewColumn()
    productName: string;

    @ViewColumn()
    totalFeedbacks: number;

    @ViewColumn()
    averageRating: number;

    @ViewColumn()
    recentFeedbacks: string;
}