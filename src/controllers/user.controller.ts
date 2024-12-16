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
  Query,
} from '@nestjs/common';
import { User } from '@entities/User.entity';
import { UserRepository } from '@/repositories/user.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import {
  CreateUserDto, LoginDto, UpdateUserDto, UserDto,
} from '@/dtos/user.dto';
import { PasswordUtils } from '@/utils/password.utils';

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
        user.password,
      );

      console.log('Password check result:', isPasswordValid);

      if (!isPasswordValid) {
        return { message: 'Неправильный логин или пароль' };
      }

      const userWithRole = await this.userRepository.findOneById(user.userId, { relations: ['role'] });
      return {
        user: {
          userId: user.userId,
          email: user.email,
          login: user.login,
          roleName: userWithRole.getRoleName(),
        },
      };
    } catch (error) {
      console.error('Error during password validation:', error);
      return { message: 'Ошибка при проверке пароля' };
    }
  }

    @Get()
    async getUsers(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: UserDto[], total: number }> {
      const { items, total } = await this.userRepository.findAll(paginationQuery);
      const usersWithRoleNames = await Promise.all(items.map(async (user) => {
        const role = user.getRoleName();
        return {
          ...user,
          roleName: role,
        };
      }));
      return { items: usersWithRoleNames, total };
    }

    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
      const user = await this.userRepository.findOneById(id, { relations: ['role'] });
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }

      return {
        userId: user.userId,
        email: user.email,
        login: user.login,
        roleName: user.getRoleName(),
      };
    }

    @Post()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
      try {
        console.log(createUserDto); // Логируем данные, полученные от клиента

        // Проверка на существующего пользователя
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
          throw new BadRequestException('Пользователь с таким email уже существует');
        }

        const user = await this.userRepository.create(createUserDto);

        // Загружаем роль для пользователя
        const userWithRole = await this.userRepository.findOneById(user.userId, { relations: ['role'] });

        return {
          userId: userWithRole.userId,
          email: userWithRole.email,
          login: userWithRole.login,
          roleName: userWithRole.getRoleName(),
        };
      } catch (err) {
        console.error('Ошибка при создании пользователя:', err);
        throw new BadRequestException(err);
      }
    }

    @Put(':id')
    async updateUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<UserDto> {
      const user = await this.userRepository.update(id, updateUserDto, userId);
      const userWithRole = await this.userRepository.findOneById(user.userId, { relations: ['role'] });

      return {
        userId: userWithRole.userId,
        email: userWithRole.email,
        login: userWithRole.login,
        roleName: userWithRole.getRoleName(),
      };
    }

    @Delete(':id')
    async deleteUser(
        @Param('id', ParseUUIDPipe) id: string,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
      await this.userRepository.remove(id, userId);
    }
}
