import { Injectable, UnauthorizedException } from "@nestjs/common";
import { BaseRepository } from "@/repositories/base.repository";
import { User } from "@entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "@entities/Role.entity";
import { LogService } from "@services/Log.service";
import { PasswordUtils } from "@/utils/password.utils";
import { UpdateUserDto } from "@/dtos/user.dto";

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
        return await this.repository.findOne({
            where: { email },
            select: ['userId', 'login', 'email', 'password', 'roleId']
        });
    }

    override async create(createDto: Partial<User>): Promise<User> {
        const defaultRole = await this.getDefaultRole();

        return super.create({
            ...createDto,
            roleId: defaultRole.roleId
        });
    }

    async update(id: string, updateDto: UpdateUserDto, userId: string): Promise<User> {
        // Создаем объект для обновления данных
        const updateData: Partial<User> = {
            login: updateDto.login,
            email: updateDto.email
        };

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