import { Injectable } from '@nestjs/common';
import { Order } from '@entities/Order.entity';
import { BaseRepository } from '@/repositories/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';

@Injectable()
export class OrderRepository extends BaseRepository<Order, 'orderId'> {
    constructor(
        @InjectRepository(Order)
            repository: Repository<Order>,
        logService: LogService,
    ) {
        super(repository, logService, 'orderId');
    }
}
