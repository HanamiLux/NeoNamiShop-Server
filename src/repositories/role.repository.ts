import { BaseRepository } from "@/repositories/base.repository";
import { Repository, FindOptionsWhere } from "typeorm";
import { LogService } from "@services/Log.service";
import { Role } from "@entities/Role.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@entities/User.entity";

@Injectable()
export class RoleRepository extends BaseRepository<Role, 'roleId'> {
    constructor(@InjectRepository(Role) repository: Repository<Role>, logService: LogService) {
        super(repository, logService, 'roleId');
    }

    async getDefaultRole(): Promise<Role> {
        const defaultRole = await this.repository.findOne({
            where: { roleName: 'user' } as FindOptionsWhere<Role>
        });

        if (!defaultRole) {
            throw new Error('Default role not found');
        }

        return defaultRole;
    }

    override async remove(id: number, userId: string): Promise<void> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entity = await this.findOneById(id);
            if (!entity) {
                throw new Error(`Entity with roleId ${id} not found`);
            }

            // Обновляем все связанные записи в таблице users, устанавливая значение по умолчанию для поля role
            await queryRunner.manager.update(User, { role: entity }, { role: await this.getDefaultRole() });

            // Удаляем саму роль
            await queryRunner.manager.remove(entity);

            await this.logService.create({
                userId,
                content: `Deleted ${this.repository.metadata.name} with roleId ${id}`,
                type: 'ENTITY_DELETE'
            });

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}