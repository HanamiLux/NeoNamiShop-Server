import {DeepPartial, FindOptionsWhere, Repository} from "typeorm";
import { PaginationQueryDto } from "@/dtos/common.dto";
import {LogService} from "@services/Log.service";

export abstract class BaseRepository<T extends Record<ID, number>, ID extends keyof T> {
    protected constructor(
        private readonly repository: Repository<T>,
        private readonly logService: LogService,
        private readonly idField: ID
    ) {}

    async create(createDto: DeepPartial<T>, userId: number): Promise<T> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entity = this.repository.create(createDto);
            await queryRunner.manager.save(entity);

            await this.logService.create({
                userId,
                content: `Created ${this.repository.metadata.name} ${JSON.stringify(entity)}`,
                type: 'ENTITY_CREATE'
            });

            await queryRunner.commitTransaction();
            return entity;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw new Error(`Failed to create ${this.repository.metadata.name}`);
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(query: PaginationQueryDto): Promise<{ items: T[], total: number }> {
        const [items, total] = await this.repository.findAndCount({
            skip: query.skip,
            take: query.take,
        });

        return { items, total };
    }

    async findOne(id: number): Promise<T | null> {
        return this.repository.findOneBy({ [this.idField]: id } as FindOptionsWhere<T>);
    }

    async findByCondition(condition: FindOptionsWhere<T>): Promise<T[]> {
        return this.repository.findBy(condition);
    }

    async update(id: number, updateDto: DeepPartial<T>, userId: number): Promise<T> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entity = await this.repository.preload({
                [this.idField]: id,
                ...updateDto
            });

            if (!entity) {
                throw new Error(`Entity with ${String(this.idField)} ${id} not found`);
            }

            await queryRunner.manager.save(entity);

            await this.logService.create({
                userId,
                content: `Updated ${this.repository.metadata.name} ${JSON.stringify(entity)}`,
                type: 'ENTITY_UPDATE'
            });

            await queryRunner.commitTransaction();
            return entity;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }


    async remove(id: number, userId: number): Promise<void> {
        const queryRunner = this.repository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const entity = await this.findOne(id);
            if (!entity) {
                throw new Error(`Entity with ${String(this.idField)} ${id} not found`);
            }

            await queryRunner.manager.remove(entity);

            await this.logService.create({
                userId,
                content: `Deleted ${this.repository.metadata.name} with ${String(this.idField)} ${id}`,
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