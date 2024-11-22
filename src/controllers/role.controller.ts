import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query} from "@nestjs/common";
import {RoleRepository} from "@/repositories/role.repository";
import {PaginationQueryDto} from "@/dtos/common.dto";
import {Role} from "@entities/Role.entity";
import {CreateRoleDto, UpdateRoleDto} from "@/dtos/role.dto";

@Controller("roles")
export class RoleController {
    constructor(private readonly roleRepository: RoleRepository) {
    }

    @Get()
    async getRoles(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Role[], total: number }> {
        return await this.roleRepository.findAll(paginationQuery);
    }

    @Get(":id")
    async getRole(@Param("id", ParseIntPipe) id: number): Promise<Role> {
        const role = await this.roleRepository.findOneById(id);
        if (!role) {
            throw new Error(`Role with ID ${id} not found`);
        }
        return role;
    }

    @Post()
    async createRole(
        @Body() createRoleDto: CreateRoleDto,
        @Query("userId", ParseIntPipe) userId: string
    ): Promise<Role> {
        return await this.roleRepository.create(createRoleDto, userId);
    }

    @Put(":id")
    async updateRole(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateRoleDto: UpdateRoleDto,
        @Query("userId", ParseIntPipe) userId: string
    ): Promise<Role> {
        return await this.roleRepository.update(id, updateRoleDto, userId);
    }

    @Delete(":id")
    async deleteRole(
        @Param("id", ParseIntPipe) id: number,
        @Query("userId", ParseIntPipe) userId: string
    ): Promise<void> {
        await this.roleRepository.remove(id, userId);
    }
}
