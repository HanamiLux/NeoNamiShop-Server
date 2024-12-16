import {
  IsString, IsNotEmpty, IsNumber, IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty()
      address: string;

    @IsNumber()
      total: number;

    @IsArray()
    @IsNotEmpty()
      products: {
        productId: number;
        quantity: number;
    }[];
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class OrderDto extends CreateOrderDto {
  orderId: number;

  date: Date;

  userId: string;
}
