import {Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query} from '@nestjs/common';
import { ProductRepository } from '@/repositories/product.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { Product } from '@entities/Product.entity';
import { CreateProductDto, UpdateProductDto } from '@/dtos/product.dto';
import {ProductFeedbackStatistics} from "@entities/productFeedbackStatistics.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductStatistics} from "@entities/productStatistics.entity";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('products')
@Controller('products')
export class ProductController {
    constructor(private readonly productRepository: ProductRepository,
                @InjectRepository(ProductFeedbackStatistics)
                private productFeedbackRepository: Repository<ProductFeedbackStatistics>,
                @InjectRepository(ProductStatistics)
                private productStatisticsRepository: Repository<ProductStatistics>) {}

    @ApiOperation({ summary: 'Get a list of products' })
    @ApiResponse({ status: 200, type: [Product] })
    @Get()
    async getProducts(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Product[], total: number }> {
        return await this.productRepository.findAll(paginationQuery);
    }

    @ApiOperation({ summary: 'Get a product' })
    @ApiResponse({ status: 200, type: [Product] })
    @Get(':id')
    async getProduct(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        const product = await this.productRepository.findOneById(id);
        if (!product) {
            throw new Error(`Product with ID ${id} not found`);
        }
        return product;
    }

    @ApiOperation({ summary: 'Create a product' })
    @ApiResponse({ status: 200, type: [Product] })
    @Post()
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Product> {
        return await this.productRepository.create(createProductDto, userId);
    }

    @ApiOperation({ summary: 'Update a product' })
    @ApiResponse({ status: 200, type: [Product] })
    @Put(':id')
    async updateProduct(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Product> {
        return await this.productRepository.update(id, updateProductDto, userId);
    }

    @ApiOperation({ summary: 'Delete a product' })
    @ApiResponse({ status: 200, description: 'Product deleted successfully' })
    @Delete(':id')
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.productRepository.remove(id, userId);
    }

    @ApiOperation({ summary: 'Get product feedbacks statistics' })
    @ApiResponse({ status: 200, type: [ProductFeedbackStatistics] })
    @Get('feedbackStats')
    async getProductFeedbackStats(): Promise<ProductFeedbackStatistics[]> {
        return this.productFeedbackRepository.find();
    }

    @ApiOperation({ summary: 'Get product statistics' })
    @ApiResponse({ status: 200, type: [ProductStatistics] })
    @Get('stats')
    async getProductStatistics(): Promise<ProductStatistics[]> {
        return this.productStatisticsRepository.find();
    }
}
