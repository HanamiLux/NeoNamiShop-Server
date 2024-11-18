import {IsString, IsNotEmpty, IsNumber, Min, IsArray, IsUrl, IsOptional} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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
    @IsUrl({}, { each: true })
    @IsOptional()
    imagesUrl?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductDto extends CreateProductDto {
    productId: number;
    averageRating: number;
    totalFeedbacks: number;
}