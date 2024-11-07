import { IsString, IsNotEmpty, Length, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// Базовый DTO для создания
export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    login: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 255)
    password: string;

    @IsString()
    @IsNotEmpty()
    roleId: number;
}

// DTO для обновления на основе CreateUserDto
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// DTO для ответа
export class UserDto extends CreateUserDto {
    userId: number;
}