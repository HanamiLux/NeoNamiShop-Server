import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query
} from '@nestjs/common';
import { UserRepository } from '@/repositories/user.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { User } from '@entities/User.entity';
import { CreateUserDto, LoginDto, UpdateUserDto, UserDto } from '@/dtos/user.dto';
import {PasswordUtils} from "@/utils/password.utils";

@Controller('users')
export class UserController {
    constructor(private readonly userRepository: UserRepository) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<{ user: UserDto } | { message: string }> {
        console.log('Received login data:', loginDto);

        const user = await this.userRepository.findByEmail(loginDto.email);

        if (!user) {
            return { message: 'Пользователя нет в системе' };
        }

        console.log('User found:', user);

        try {
            const isPasswordValid = await PasswordUtils.compare(
                loginDto.password,
                user.password
            );

            console.log('Password check result:', isPasswordValid);

            if (!isPasswordValid) {
                return { message: 'Неправильный логин или пароль' };
            }

            return {
                user: {
                    userId: user.userId,
                    email: user.email,
                    login: user.login,
                }
            };
        } catch (error) {
            console.error('Error during password validation:', error);
            return { message: 'Ошибка при проверке пароля' };
        }
    }

    @Get()
    async getUsers(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: User[], total: number }> {
        return await this.userRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        const user = await this.userRepository.findOneById(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        try {
            console.log(createUserDto);  // Логируем данные, полученные от клиента

            // Проверка на существующего пользователя
            const existingUser = await this.userRepository.findByEmail(createUserDto.email);
            if (existingUser) {
                throw new BadRequestException('Пользователь с таким email уже существует');
            }

            return await this.userRepository.create(createUserDto);
        } catch (err) {
            console.error('Ошибка при создании пользователя:', err);
            throw new BadRequestException(err);
        }
    }

    @Put(':id')
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<User> {
        return await this.userRepository.update(id, updateUserDto, userId);
    }

    @Delete(':id')
    async deleteUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.userRepository.remove(id, userId);
    }
}