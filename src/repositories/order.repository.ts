import { Injectable } from '@nestjs/common';
import { Order } from '@entities/Order.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';
import {OrderResponseDto} from "@/dtos/orderedProduct.dto";
import {Product} from "@entities/Product.entity";
import {OrderedProduct} from "@entities/OrderedProduct.entity";
import {CreateOrderDto} from "@/dtos/order.dto";
import {PaginationQueryDto} from "@/dtos/common.dto";

@Injectable()
export class OrderRepository extends BaseRepository<Order, 'orderId'> {
    constructor(
        @InjectRepository(Order)
            repository: Repository<Order>,
        logService: LogService
    ) {
        super(repository, logService, 'orderId');
    }

    // Новые методы для работы с DTO
    async findAllWithProducts(query: PaginationQueryDto): Promise<{ items: OrderResponseDto[], total: number }> {
        const [orders, total] = await this.repository.createQueryBuilder('order')
            .leftJoinAndSelect('order.orderedProducts', 'orderedProducts')
            .skip(query.skip)
            .take(query.take)
            .getManyAndCount();

        return {
            items: orders.map(order => this.mapOrderToDto(order)),
            total
        };
    }

    async findOneWithProducts(id: number): Promise<OrderResponseDto | null> {
        const order = await this.repository.findOne({
            where: { orderId: id },
            relations: {
                orderedProducts: true
            }
        });

        if (!order) {
            return null;
        }

        return this.mapOrderToDto(order);
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // Создаем заказ
            const order = this.repository.create({
                userId,
                status: 'pending',
                total: createOrderDto.total,
            });

            await queryRunner.manager.save(order);

            // Создаем orderedProducts для каждого продукта
            const orderedProducts = await Promise.all(
                createOrderDto.products.map(async (productData) => {
                    const product = await queryRunner.manager.findOne(Product, {
                        where: { productId: productData.productId }
                    });

                    if (!product) {
                        throw new Error(`Product with ID ${productData.productId} not found`);
                    }

                    const orderedProduct = new OrderedProduct();
                    orderedProduct.order = order;
                    orderedProduct.product = product;
                    orderedProduct.quantity = productData.quantity;
                    orderedProduct.productName = product.productName;
                    orderedProduct.description = product.description;
                    orderedProduct.priceAtOrder = product.price;
                    orderedProduct.imagesUrlAtOrder = product.imagesUrl;

                    return queryRunner.manager.save(orderedProduct);
                })
            );

            order.orderedProducts = orderedProducts;

            await this.logService.create({
                userId,
                content: `Created order ${order.orderId}`,
                type: 'ENTITY_CREATE'
            });

            await queryRunner.commitTransaction();
            return order;

        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    private mapOrderToDto(order: Order): OrderResponseDto {
        return {
            orderId: order.orderId,
            userId: order.userId,
            date: order.date,
            status: order.status,
            total: order.total,
            products: order.orderedProducts.map(product => ({
                orderedProductId: product.orderedProductId,
                productId: product.productId,
                quantity: product.quantity,
                productName: product.productName,
                description: product.description,
                priceAtOrder: product.priceAtOrder,
                imagesUrlAtOrder: product.imagesUrlAtOrder
            }))
        };
    }
}
