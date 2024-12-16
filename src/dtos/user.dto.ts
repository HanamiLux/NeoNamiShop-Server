import {
  IsString, IsNotEmpty, Length, IsEmail, IsOptional, IsNumber,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/swagger';

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
}

// Комбинированный DTO для обновления
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(2, 50)
      login?: string;

    @IsOptional()
    @IsEmail()
      email?: string;

    @IsOptional()
    @IsString()
      currentPassword?: string;

    @IsOptional()
    @IsString()
    @Length(6, 255)
      newPassword?: string;

    @IsOptional()
    @IsNumber()
      roleId: number;
}

// DTO для ответа
export class UserDto extends PartialType(CreateUserDto) {
  userId: string;

  roleName: string;
}

export class LoginDto {
    @IsEmail()
      email: string;

    @IsString()
      password: string;
}
