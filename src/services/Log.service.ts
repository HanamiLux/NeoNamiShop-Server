import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '@entities/Log.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { ILogDto } from '@/dtos/log.dto';

@Injectable()
export class LogService {
  constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
  ) {}

  async create(logDto: ILogDto) {
    const log = this.logRepository.create(logDto);
    await this.logRepository.save(log);
  }

  async findAll(query: PaginationQueryDto): Promise<{ items: Log[], total: number }> {
    const [items, total] = await this.logRepository.findAndCount({
      order: { date: 'DESC' },
      skip: query.skip,
      take: query.take,
    });

    return { items, total };
  }
}
