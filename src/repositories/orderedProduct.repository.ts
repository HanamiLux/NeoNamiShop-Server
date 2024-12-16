import { Injectable } from '@nestjs/common';
import { OrderedProduct } from '@entities/OrderedProduct.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';
import { BaseRepository } from '@/repositories/base.repository';

@Injectable()
export class OrderedProductRepository extends BaseRepository<OrderedProduct, 'orderedProductId'> {
  constructor(
        @InjectRepository(OrderedProduct)
          repository: Repository<OrderedProduct>,
          logService: LogService,
  ) {
    super(repository, logService, 'orderedProductId');
  }
}
