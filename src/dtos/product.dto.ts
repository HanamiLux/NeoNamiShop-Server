import {IsString, IsNotEmpty, IsNumber, Min, IsArray, IsUrl, IsOptional} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import {Feedback} from "@entities/Feedback.entity";
import {plainToInstance} from "class-transformer";
import {Product} from "@entities/Product.entity";
import {CategoryDto} from "@/dtos/category.dto";
import {FeedbackDto} from "@/dtos/feedback.dto";
import {OrderedProductResponseDto} from "@/dtos/orderedProduct.dto";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    productName: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    @IsArray()
    @IsOptional()
    imagesUrl?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}


export class ProductDto extends CreateProductDto {
    productId: number;
    averageRating: number;
    totalFeedbacks: number;
    category: CategoryDto;
    orderedProducts: OrderedProductResponseDto[];
    feedbacks: FeedbackDto[];
}

export function toProductDto(product: Product): ProductDto {
    const dto = plainToInstance(ProductDto, product);
    dto.averageRating = calculateAverageRating(product.feedbacks); // Пример вычисления поля
    dto.totalFeedbacks = product.feedbacks?.length || 0;
    dto.category = plainToInstance(CategoryDto, product.category);
    dto.orderedProducts = product.orderedProducts?.map(op => plainToInstance(OrderedProductResponseDto, op)) || [];
    dto.feedbacks = product.feedbacks?.map(f => plainToInstance(FeedbackDto, f)) || [];
    return dto;
}

function calculateAverageRating(feedbacks: Feedback[] = []): number {
    if (feedbacks.length === 0) {
        return 0; // Если отзывов нет, рейтинг 0
    }
    const totalRating = feedbacks.reduce((sum, feedback) => sum + (feedback.rate || 0), 0);
    return parseFloat((totalRating / feedbacks.length).toFixed(2)); // Усреднение с округлением до 2 знаков
}