import {Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query} from '@nestjs/common';
import { ProductRepository } from '@/repositories/product.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { Product } from '@entities/Product.entity';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';

@Controller('products')
export class ProductController {
    constructor(private readonly productRepository: ProductRepository) {}

    @Get()
    async getProducts(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Product[], total: number }> {
        return await this.productRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        const product = await this.productRepository.findOne(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    @Post()
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Product> {
        return await this.productRepository.create(createProductDto, userId);
    }

    @Put(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Product> {
        return await this.productRepository.update(id, updateProductDto, userId);
    }

    @Delete(':id')
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.productRepository.remove(id, userId);
    }
}
