import { Category } from "@/entities/Category.entity";
import {BaseRepository} from "@/repositories/base.repository";
import {Repository} from "typeorm";
import {LogService} from "@services/Log.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class CategoryRepository extends BaseRepository<Category, 'categoryId'> {
    constructor(@InjectRepository(Category) repository: Repository<Category>, logService: LogService) {
        super(repository, logService, 'categoryId');
    }
}