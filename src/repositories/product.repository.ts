import { Injectable } from '@nestjs/common';
import { Product } from '@entities/Product.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';
import {PaginationQueryDto} from "@/dtos/common.dto";

@Injectable()
export class ProductRepository extends BaseRepository<Product, 'productId'> {
    constructor(
        @InjectRepository(Product)
        repository: Repository<Product>,
        logService: LogService,
    ) {
        super(repository, logService, 'productId');
    }

    override async findAll(query: PaginationQueryDto): Promise<{ items: Product[], total: number }> {
        try {
            const [items, total] = await this.repository.findAndCount({
                skip: query.skip,
                take: query.take,
                // relations: ['feedbacks', 'category'],
            });
            return { items, total };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to fetch products');
        }
    }
}
