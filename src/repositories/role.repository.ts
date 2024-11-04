import {BaseRepository} from "@/repositories/base.repository";
import {Repository} from "typeorm";
import {LogService} from "@services/Log.service";
import {Role} from "@entities/Role.entity";
import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class RoleRepository extends BaseRepository<Role, 'roleId'> {
    constructor(@InjectRepository(Role) repository: Repository<Role>, logService: LogService) {
        super(repository, logService, 'roleId');
    }
}