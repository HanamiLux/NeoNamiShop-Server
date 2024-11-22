import {Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query} from '@nestjs/common';
import { CategoryRepository } from '@/repositories/category.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { Category } from '@entities/Category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '@/dtos/category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryRepository: CategoryRepository) {}

    @Get()
    async getCategories(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Category[], total: number }> {
        return await this.categoryRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getCategory(@Param('id', ParseIntPipe) id: number): Promise<Category> {
        const category = await this.categoryRepository.findOneById(id);
        if (!category) {
            throw new Error(`Category with ID ${id} not found`);
        }
        return category;
    }

    @Post()
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Category> {
        return await this.categoryRepository.create(createCategoryDto, userId);
    }

    @Put(':id')
    async updateCategory(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Category> {
        return await this.categoryRepository.update(id, updateCategoryDto, userId);
    }

    @Delete(':id')
    async deleteCategory(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.categoryRepository.remove(id, userId);
    }
}