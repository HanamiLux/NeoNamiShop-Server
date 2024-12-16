import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);
const BACKUP_DIR = './backups';
const MAX_BACKUPS = 7; // Хранить бэкапы за последнюю неделю

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor() {
    // Создаем директорию для бэкапов если её нет
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
  }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async createBackup() {
    const date = new Date().toISOString().split('T')[0];
    const filename = `backup-${date}.sql`;
    const filePath = path.join(BACKUP_DIR, filename);

    try {
      // Создаем бэкап
      const { stdout, stderr } = await execAsync(
        `PGPASSWORD="${process.env.DB_PASSWORD}" pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} > ${filePath}`,
      );

      if (stderr) {
        this.logger.error(`Backup stderr: ${stderr}`);
      }

      this.logger.log(`Backup created successfully: ${filename}`);
      if (stdout) {
        this.logger.debug(`Backup stdout: ${stdout}`);
      }

      // Удаляем старые бэкапы
      await this.cleanOldBackups();
    } catch (error) {
      this.logger.error('Backup failed:', error);
    }
  }

    private async cleanOldBackups() {
      try {
        const files = fs.readdirSync(BACKUP_DIR)
          .filter((file) => file.endsWith('.sql'))
          .map((file) => ({
            name: file,
            path: path.join(BACKUP_DIR, file),
            created: fs.statSync(path.join(BACKUP_DIR, file)).ctime,
          }))
          .sort((a, b) => b.created.getTime() - a.created.getTime());

        // Удаляем файлы старше MAX_BACKUPS дней
        for (let i = MAX_BACKUPS; i < files.length; i++) {
          fs.unlinkSync(files[i].path);
          this.logger.log(`Deleted old backup: ${files[i].name}`);
        }
      } catch (error) {
        this.logger.error('Failed to clean old backups:', error);
      }
    }

    // Метод для ручного создания бэкапа
    async createManualBackup(note: string = '') {
      const date = new Date().toISOString().replace(/[:]/g, '-');
      const filename = `manual-backup-${date}${note ? `-${note}` : ''}.sql`;
      const filePath = path.join(BACKUP_DIR, filename);

      try {
        await execAsync(
          `PGPASSWORD="${process.env.DB_PASSWORD}" pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} > ${filePath}`,
        );
        return filename;
      } catch (error) {
        throw new Error(`Manual backup failed: ${error.message}`);
      }
    }
}
