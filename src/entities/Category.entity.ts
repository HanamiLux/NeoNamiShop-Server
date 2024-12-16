import {
  Column, Entity, OneToMany, PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '@entities/Product.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn()
      categoryId: number;

    @Column({ length: 50 })
      categoryName: string;

    @Column('text')
      description: string;

    @OneToMany(() => Product, (product) => product.category, {
      nullable: true, // Разрешаем null для связи
    })
      products: Product[];
}
