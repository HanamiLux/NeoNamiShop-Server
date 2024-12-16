import { Repository } from 'typeorm';
import { LogService } from '@services/Log.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@/repositories/base.repository';
import { Category } from '@/entities/Category.entity';

@Injectable()
export class CategoryRepository extends BaseRepository<Category, 'categoryId'> {
  constructor(@InjectRepository(Category) repository: Repository<Category>, logService: LogService) {
    super(repository, logService, 'categoryId');
  }
}
