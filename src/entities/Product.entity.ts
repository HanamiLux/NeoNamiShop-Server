import {Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Category} from "@entities/Category.entity";
import {OrderedProduct} from "@entities/OrderedProduct.entity";
import {Feedback} from "@entities/Feedback.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    productId: number

    @Column({ length: 255 })
    productName: string

    @Column("text")
    description: string

    @Column()
    categoryId: number

    @Column()
    price: number

    @Column()
    quantity: number

    @Column("text", { array: true })
    imagesUrl: string[]

    @ManyToOne(() => Category)
    category: Category

    @OneToMany(() => OrderedProduct, orderedProduct => orderedProduct.product)
    orderedProducts: OrderedProduct[]

    @ManyToMany(() => Feedback, feedback => feedback.products)
    feedbacks: Feedback[]
}