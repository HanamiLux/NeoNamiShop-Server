import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "@entities/User.entity";
import {Product} from "@entities/Product.entity";

@Entity("feedbacks")
export class Feedback {
    @PrimaryGeneratedColumn()
    feedbackId: number;

    @Column()
    userId: string;

    @Column()
    rate: number;

    @Column("text")
    content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    date: Date;

    @ManyToOne(() => User, user => user.feedbacks)
    user: User;

    @ManyToMany(() => Product, product => product.feedbacks)
    products: Product[];
}