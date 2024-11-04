import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Log} from "@entities/Log.entity";
import {Repository} from "typeorm";


@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) {}
    async create(logDto: LogDto) {
        const log = this.logRepository.create(logDto);
        await this.logRepository.save(log);
    }
}