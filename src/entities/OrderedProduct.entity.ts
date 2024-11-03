import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "@entities/Order.entity";
import {Product} from "@entities/Product.entity";

@Entity("orderedProducts")
export class OrderedProduct {
    @PrimaryGeneratedColumn()
    orderedProductId: number

    @Column()
    orderId: number

    @Column()
    productId: number

    @Column()
    quantity: number

    @ManyToOne(() => Order, order => order.orderedProducts)
    order: Order

    @ManyToOne(() => Product, product => product.orderedProducts)
    product: Product
}