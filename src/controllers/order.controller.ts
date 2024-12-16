import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Order } from '@entities/Order.entity';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { CreateOrderDto, UpdateOrderDto } from '@/dtos/order.dto';
import { OrderRepository } from '@/repositories/order.repository';
import { OrderResponseDto } from '@/dtos/orderedProduct.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderRepository) {}

    @Get()
  async getOrders(
        @Query() paginationQuery: PaginationQueryDto,
  ): Promise<{ items: OrderResponseDto[], total: number }> {
    return await this.orderService.findAllWithProducts(paginationQuery);
  }

    @Get('user/:userId')
    async getOrdersByUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<{ items: OrderResponseDto[], total: number }> {
      return await this.orderService.findAllWithProductsByUser(userId, paginationQuery);
    }

    @Get(':id')
    async getOrder(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<OrderResponseDto> {
      const order = await this.orderService.findOneWithProducts(id);
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      return order;
    }

    @Post()
    async createOrder(
        @Body() createOrderDto: CreateOrderDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<OrderResponseDto> {
      const order = await this.orderService.createOrder(createOrderDto, userId);
      return this.orderService.findOneWithProducts(order.orderId);
    }

    @Put(':id')
    async updateOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateOrderDto: Partial<UpdateOrderDto>,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<Order> {
      return await this.orderService.update(id, updateOrderDto, userId);
    }

    @Delete(':id')
    async deleteOrder(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
      await this.orderService.remove(id, userId);
    }
}
