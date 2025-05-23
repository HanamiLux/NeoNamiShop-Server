import { Feedback } from '@entities/Feedback.entity';
import { LogService } from '@services/Log.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { BaseRepository } from '@/repositories/base.repository';

@Injectable()
export class FeedbackRepository extends BaseRepository<Feedback, 'feedbackId'> {
  constructor(@InjectRepository(Feedback) repository: Repository<Feedback>, logService: LogService) {
    super(repository, logService, 'feedbackId');
  }

  async findByProduct(productId: number, paginationQuery: PaginationQueryDto): Promise<{ items: Feedback[], total: number }> {
    const query = this.repository.createQueryBuilder('feedback')
      .where('feedback.productId = :productId', { productId })
      .skip(paginationQuery.skip)
      .take(paginationQuery.take);

    const items = await query.getMany();
    const total = await query.getCount();

    return { items, total };
  }

  async findByUser(userId: string, paginationQuery: PaginationQueryDto): Promise<{ items: Feedback[], total: number }> {
    const query = this.repository.createQueryBuilder('feedback')
      .leftJoinAndSelect('feedback.user', 'user')
      .where('user.userId = :userId', { userId })
      .skip(paginationQuery.skip)
      .take(paginationQuery.take);

    const items = await query.getMany();
    const total = await query.getCount();

    return { items, total };
  }
}
