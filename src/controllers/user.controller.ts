import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { UserRepository } from '@/repositories/user.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { User } from '@entities/User.entity';
import { CreateUserDto, UpdateUserDto } from '@/dtos/user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userRepository: UserRepository) {}

    @Get()
    async getUsers(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: User[], total: number }> {
        return await this.userRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return user;
    }

    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<User> {
        return await this.userRepository.create(createUserDto, userId);
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