import {
    Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@entities/User.entity';
import { Product } from '@entities/Product.entity';

@Entity('feedbacks')
export class Feedback {
    @PrimaryGeneratedColumn()
      feedbackId: number;

    @Column()
      userId: string;

    @Column()
      rate: number;

    @Column()
    productId: number;

    @Column('text')
      content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      date: Date;

    @ManyToOne(() => User, (user) => user.feedbacks)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Product, (product) => product.feedbacks)
    @JoinColumn({ name: 'productId' })
      product: Product;
}
