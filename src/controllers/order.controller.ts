import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { OrderRepository } from '@/repositories/order.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { Order } from '@entities/Order.entity';
import { CreateOrderDto, UpdateOrderDto } from '@/dtos/order.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderRepository: OrderRepository) {}

    @Get()
    async getOrders(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Order[], total: number }> {
        return await this.orderRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getOrder(@Param('id', ParseUUIDPipe) id: number): Promise<Order> {
        const order = await this.orderRepository.findOneById(id);
        if (!order) {
            throw new Error(`Order with ID ${id} not found`);
        }
        return order;
    }

    @Post()
    async createOrder(
        @Body() createOrderDto: CreateOrderDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Order> {
        return await this.orderRepository.create(createOrderDto, userId);
    }

    @Put(':id')
    async updateOrder(
        @Param('id', ParseUUIDPipe) id: number,
        @Body() updateOrderDto: UpdateOrderDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Order> {
        return await this.orderRepository.update(id, updateOrderDto, userId);
    }

    @Delete(':id')
    async deleteOrder(
        @Param('id', ParseUUIDPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.orderRepository.remove(id, userId);
    }
}