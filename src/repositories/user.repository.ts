import {BaseRepository} from "@/repositories/base.repository";
import {User} from "@entities/User.entity";
import {Repository} from "typeorm";
import {LogService} from "@services/Log.service";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends BaseRepository<User, 'userId'> {
    constructor(@InjectRepository(User) repository: Repository<User>, logService: LogService) {
        super(repository, logService, 'userId');
    }
}