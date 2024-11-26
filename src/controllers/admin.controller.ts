import {
    BadRequestException,
    Controller,
    Get,
    InternalServerErrorException,
    Post,
    Res,
    UploadedFile,
    UseInterceptors,
    Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';

@Controller('admin/database')
export class DatabaseBackupController {
    private readonly BACKUP_DIR = path.join(process.cwd(), 'database_backups');
    private readonly DATABASE_CONFIG = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || '5432',
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    };

    constructor() {
        // Создаем директорию для бэкапов, если она не существует
        if (!fs.existsSync(this.BACKUP_DIR)) {
            fs.mkdirSync(this.BACKUP_DIR);
        }
    }

    @Get('backup')
    async createBackup(@Res() res: Response): Promise<void> {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupFileName = `database_backup_${timestamp}.sql`;
        const backupPath = path.join(this.BACKUP_DIR, backupFileName);

        try {
            // PostgreSQL pg_dump команда с полными параметрами
            const dumpCommand = [
                '"C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe"',
                `-h ${this.DATABASE_CONFIG.host}`,
                `-p ${this.DATABASE_CONFIG.port}`,
                `-U ${this.DATABASE_CONFIG.user}`,
                `-d ${this.DATABASE_CONFIG.database}`,
                `-f ${backupPath}`,
                '-F p',
                '--clean',
                '--no-owner',
                '--no-acl'
            ].join(' ');

            await new Promise<void>((resolve, reject) => {
                exec(dumpCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Stderr:', stderr);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Отправляем файл для скачивания
            res.download(backupPath, backupFileName, (err) => {
                if (err) {
                    throw new InternalServerErrorException('Ошибка при скачивании файла бэкапа');
                }
            });
        } catch (error) {
            console.error('Ошибка создания бэкапа:', error);
            throw new InternalServerErrorException('Не удалось создать резервную копию базы данных');
        }
    }

    @Post('restore')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './database_backups',
            filename: (req, file, cb) => {
                const timestamp = new Date().toISOString().replace(/:/g, '-');
                cb(null, `restore_${timestamp}_${file.originalname}`);
            }
        }),
        fileFilter: (req, file, cb) => {
            const allowedTypes = ['.sql'];
            const ext = path.extname(file.originalname).toLowerCase();
            if (allowedTypes.includes(ext)) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Неподдерживаемый тип файла. Разрешены только .sql файлы.'), false);
            }
        }
    }))
    async restoreDatabase(
        @UploadedFile() file: Express.Multer.File,
        @Res() res: Response
    ): Promise<void> {
        if (!file) {
            throw new BadRequestException('Файл не загружен');
        }

        try {
            // PostgreSQL psql команда восстановления
            const restoreCommand = [
                'psql',
                `-h ${this.DATABASE_CONFIG.host}`,
                `-p ${this.DATABASE_CONFIG.port}`,
                `-U ${this.DATABASE_CONFIG.user}`,
                `-d ${this.DATABASE_CONFIG.database}`,
                `-f ${file.path}`
            ].join(' ');

            await new Promise<void>((resolve, reject) => {
                exec(restoreCommand, {
                    env: {
                        ...process.env, // сохраняем текущие переменные окружения
                        PGPASSWORD: this.DATABASE_CONFIG.password // добавляем пароль
                    }
                }, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Stderr:', stderr);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Удаляем временный файл после восстановления
            fs.unlinkSync(file.path);

            res.status(200).json({
                message: 'База данных успешно восстановлена',
                filename: file.originalname
            });
        } catch (error) {
            console.error('Ошибка восстановления:', error);
            throw new InternalServerErrorException('Не удалось восстановить базу данных');
        }
    }

    @Get('export')
    async exportData(@Query('type') type: string, @Res() res: Response): Promise<void> {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const fileExtension = type === 'full' ? 'sql' : 'csv';
        const exportFileName = `export_${type}_${timestamp}.${fileExtension}`;
        const exportPath = path.join(this.BACKUP_DIR, exportFileName);

        try {
            // Validate database configuration
            if (!this.DATABASE_CONFIG.user || !this.DATABASE_CONFIG.database) {
                throw new InternalServerErrorException('Database configuration is incomplete');
            }

            let exportCommand = '';
            switch (type) {
                case 'users':
                    exportCommand = [
                        'psql',
                        `-h ${this.DATABASE_CONFIG.host}`,
                        `-p ${this.DATABASE_CONFIG.port}`,
                        `-U ${this.DATABASE_CONFIG.user}`,
                        `-d ${this.DATABASE_CONFIG.database}`,
                        `-c "\\copy (SELECT * FROM users) TO '${exportPath}' WITH CSV HEADER"`
                    ].join(' ');
                    break;
                case 'products':
                    exportCommand = [
                        'psql',
                        `-h ${this.DATABASE_CONFIG.host}`,
                        `-p ${this.DATABASE_CONFIG.port}`,
                        `-U ${this.DATABASE_CONFIG.user}`,
                        `-d ${this.DATABASE_CONFIG.database}`,
                        `-c "\\copy (SELECT * FROM products) TO '${exportPath}' WITH CSV HEADER"`
                    ].join(' ');
                    break;
                case 'orders':
                    exportCommand = [
                        'psql',
                        `-h ${this.DATABASE_CONFIG.host}`,
                        `-p ${this.DATABASE_CONFIG.port}`,
                        `-U ${this.DATABASE_CONFIG.user}`,
                        `-d ${this.DATABASE_CONFIG.database}`,
                        `-c "\\copy (SELECT * FROM orders) TO '${exportPath}' WITH CSV HEADER"`
                    ].join(' ');
                    break;
                case 'full':
                    exportCommand = [
                        'pg_dump',
                        `-h ${this.DATABASE_CONFIG.host}`,
                        `-p ${this.DATABASE_CONFIG.port}`,
                        `-U ${this.DATABASE_CONFIG.user}`,
                        `-d ${this.DATABASE_CONFIG.database}`,
                        `-f ${exportPath}`,
                        '-F p', // Plain text format
                        '--clean',
                        '--no-owner',
                        '--no-acl'
                    ].join(' ');
                    break;
                default:
                    throw new BadRequestException('Unsupported export type');
            }

            console.log('Export Command:', exportCommand);
            console.log('Database Config:', JSON.stringify(this.DATABASE_CONFIG, null, 2));

            // Execute the export command with PGPASSWORD in the environment
            await new Promise<void>((resolve, reject) => {
                exec(exportCommand, {
                    env: {
                        ...process.env,
                        PGPASSWORD: this.DATABASE_CONFIG.password
                    }
                }, (error, stdout, stderr) => {
                    if (error) {
                        console.error('Export Error Stderr:', stderr);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Send the file for download
            res.download(exportPath, exportFileName, (err) => {
                if (err) {
                    throw new InternalServerErrorException('Error downloading the exported file');
                }
            });
        } catch (error) {
            console.error('Export Error:', error);
            throw new InternalServerErrorException(`Failed to export data: ${error.message}`);
        }
    }
}

export default DatabaseBackupController;