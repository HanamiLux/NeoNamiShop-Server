import {Injectable} from "@nestjs/common";
import {BaseRepository} from "@/repositories/base.repository";
import {User} from "@entities/User.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Role} from "@entities/Role.entity";
import {LogService} from "@services/Log.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserRepository extends BaseRepository<User, 'userId'> {
    constructor(
        @InjectRepository(User) repository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        logService: LogService
    ) {
        super(repository, logService, 'userId');
    }

    private async getDefaultRole(): Promise<Role> {
        const defaultRole = await this.roleRepository.findOne({
            where: { roleName: 'user' }
        });

        if (!defaultRole) {
            throw new Error('Default role not found');
        }

        return defaultRole;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({ where: { email }, select: ['userId', 'login', 'email', 'password', 'roleId'] });
    }

    override async create(createDto: Partial<User>): Promise<User> {
        const defaultRole = await this.getDefaultRole();

        return super.create({
            ...createDto,
            roleId: defaultRole.roleId
        });
    }
}