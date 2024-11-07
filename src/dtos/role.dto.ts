import { IsString, IsNotEmpty, Length } from 'class-validator';
import {PartialType} from "@nestjs/swagger";

// Базовый DTO для создания
export class CreateRoleDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    roleName: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}

// DTO для обновления на основе CreateRoleDto
export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

// DTO для ответа
export class RoleDto extends CreateRoleDto {
    roleId: number;
}