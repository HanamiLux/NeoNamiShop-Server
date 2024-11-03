import { Injectable } from '@nestjs/common';

interface LogDto {
    userId: number;
    content: string;
    type: string;
}

@Injectable()
export class LogService {
    async create(logDto: LogDto) {
        // Логика создания лога
    }
}