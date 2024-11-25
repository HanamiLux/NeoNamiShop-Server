import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Order} from "@entities/Order.entity";
import {Product} from "@entities/Product.entity";

@Entity("orderedProducts")
export class OrderedProduct {
    @PrimaryGeneratedColumn()
    orderedProductId: number;

    @Column()
    orderId: number;

    @Column({ nullable: true })
    @Index()
    productId: number;

    @Column()
    quantity: number;

    // Информация о товаре на момент заказа
    @Column({ length: 255 })
    productName: string;  // Название товара при заказе

    @Column("text", { nullable: true })
    description: string;  // Описание товара при заказе

    @Column()
    priceAtOrder: number;  // Цена на момент заказа

    @Column("text", { array: true, nullable: true })
    imagesUrlAtOrder?: string[];  // URL изображений на момент заказа

    @ManyToOne(() => Order, order => order.orderedProducts, {
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @ManyToOne(() => Product, product => product.orderedProducts, {
        onDelete: 'SET NULL',
        nullable: true
    })
    @JoinColumn({ name: 'productId' })
    product: Product;
}