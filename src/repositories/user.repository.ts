import { Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseRepository } from "@/repositories/base.repository";
import { User } from "@entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "@entities/Role.entity";
import { LogService } from "@services/Log.service";
import { PasswordUtils } from "@/utils/password.utils";
import { UpdateUserDto } from "@/dtos/user.dto";
import {PaginationQueryDto} from "@/dtos/common.dto";
import {RoleRepository} from "@/repositories/role.repository";

@Injectable()
export class UserRepository extends BaseRepository<User, 'userId'> {
    constructor(
        @InjectRepository(User) repository: Repository<User>,
        @InjectRepository(Role) private roleRepository: RoleRepository,
        logService: LogService
    ) {
        super(repository, logService, 'userId');
    }

    override async findAll(query: PaginationQueryDto): Promise<{ items: User[], total: number }> {
        const [items, total] = await this.repository.findAndCount({
            skip: query.skip,
            take: query.take,
            relations: ["role", "feedbacks", "orders"]
        });

        return { items, total };
    }



    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({
            where: { email },
            select: ['userId', 'login', 'email', 'password', 'roleId']
        });
    }

    override async create(createDto: Partial<User>): Promise<User> {
        try {
            const defaultRole = await this.roleRepository.getDefaultRole();
            const user = this.repository.create({
                ...createDto,
                roleId: defaultRole.roleId
            });
            return await this.repository.save(user);
        }catch(error) {
            console.log(error);
            const user = this.repository.create({
                ...createDto,
                roleId: 1
            });
            return await this.repository.save(user);
        }




    }

    async update(id: string, updateDto: UpdateUserDto, userId: string): Promise<User> {
        // Создаем объект для обновления данных
        const updateData: Partial<User> = {
            login: updateDto.login,
            email: updateDto.email
        };

        if(updateDto.roleId){
            updateData.roleId = updateDto.roleId;
        }

        // Если пытаемся обновить пароль
        if (updateDto.newPassword) {
            const currentUser = await this.repository.findOne({
                where: { userId: id },
                select: ['userId', 'password']
            });

            if (!currentUser) {
                throw new Error('User not found');
            }

            // Проверяем текущий пароль
            if (!updateDto.currentPassword) {
                throw new UnauthorizedException('Current password is required to change password');
            }

            const isPasswordValid = await PasswordUtils.compare(
                updateDto.currentPassword,
                currentUser.password
            );

            if (!isPasswordValid) {
                throw new UnauthorizedException('Current password is incorrect');
            }

            // Добавляем новый пароль к данным для обновления
            updateData.password = updateDto.newPassword;
        }

        // Проверяем уникальность email
        if (updateDto.email) {
            const existingUser = await this.findByEmail(updateDto.email);
            if (existingUser && existingUser.userId !== id) {
                throw new Error('Email already in use');
            }
        }

        // Убираем undefined поля
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        return super.update(id, updateData, userId);
    }

}