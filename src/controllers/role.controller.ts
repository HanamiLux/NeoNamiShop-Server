import {Controller, Get, Query} from "@nestjs/common";
import {RoleRepository} from "@/repositories/role.repository";
import {PaginationQueryDto} from "@/dtos/common.dto";
import {Role} from "@entities/Role.entity";

@Controller("roles")
export class RoleController {
    constructor(private readonly roleRepository: RoleRepository) {}

    @Get()
    async getRoles(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Role[], total: number }> {
        return await this.roleRepository.findAll(paginationQuery);
    }
}
