import { Injectable } from '@nestjs/common';
import { Product } from '@entities/Product.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';

@Injectable()
export class ProductRepository extends BaseRepository<Product, 'productId'> {
    constructor(
        @InjectRepository(Product)
        repository: Repository<Product>,
        logService: LogService,
    ) {
        super(repository, logService, 'productId');
    }
}
