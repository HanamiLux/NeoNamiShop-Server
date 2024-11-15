import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Product} from "@entities/Product.entity";
import {Feedback} from "@entities/Feedback.entity";

@Entity("product_feedbacks")
export class ProductFeedback {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.feedbacks)
    product: Product;

    @ManyToOne(() => Feedback, feedback => feedback.products)
    feedback: Feedback;
}