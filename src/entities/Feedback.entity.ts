import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "@entities/User.entity";
import {Product} from "@entities/Product.entity";

@Entity("feedbacks")
export class Feedback {
    @PrimaryGeneratedColumn()
    feedbackId: number

    @Column()
    userId: string

    @Column()
    productId: number

    @Column()
    rate: number

    @Column("text")
    content: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date

    @ManyToOne(() => User, user => user.feedbacks)
    user: User

    @ManyToOne(() => Product, product => product.feedbacks)
    product: Product
}