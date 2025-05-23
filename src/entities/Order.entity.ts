import {
    Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@entities/User.entity';
import { OrderedProduct } from '@entities/OrderedProduct.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
      orderId: number;

    @Column()
      userId: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
      date: Date;

    @Column({ length: 50 })
      status: string;

    @Column()
      total: number;

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'userId' })
      user: User;

    @OneToMany(() => OrderedProduct, (orderedProduct) => orderedProduct.order)
      orderedProducts: OrderedProduct[];
}
