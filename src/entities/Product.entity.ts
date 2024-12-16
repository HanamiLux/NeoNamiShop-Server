import {
  Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '@entities/Category.entity';
import { OrderedProduct } from '@entities/OrderedProduct.entity';
import { Feedback } from '@entities/Feedback.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
      productId: number;

    @Column({ length: 255 })
      productName: string;

    @Column('text')
      description: string;

    @Column({ nullable: true }) // Разрешаем null для categoryId
      categoryId: number;

    @Column()
      price: number;

    @Column()
      quantity: number;

    @Column('text', { array: true })
      imagesUrl?: string[];

    @ManyToOne(() => Category, (category) => category.products, {
      onDelete: 'SET NULL', // При удалении категории установить NULL
      nullable: true, // Разрешаем null для связи
    })
    @JoinColumn({ name: 'categoryId' })
      category: Category;

    @Column({ default: true })
      isActive: boolean;

    @OneToMany(() => OrderedProduct, (orderedProduct) => orderedProduct.product)
      orderedProducts: OrderedProduct[];

    @ManyToMany(() => Feedback, (feedback) => feedback.products)
    @JoinTable()
      feedbacks: Feedback[];
}
