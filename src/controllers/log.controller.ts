import { Controller, Get, Query } from '@nestjs/common';
import { Log } from '@entities/Log.entity';
import { LogService } from '@services/Log.service';
import { PaginationQueryDto } from '@/dtos/common.dto';

@Controller('logs')
export class LogController {
  constructor(private readonly logRepository: LogService) {}

    @Get()
  async getLogs(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Log[], total: number }> {
    return await this.logRepository.findAll(paginationQuery);
  }
}
