import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export interface ILogDto {
    userId: string;
    content: string;
    type: string;
}

enum LogType {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export class CreateLogDto {
    @IsEnum(LogType)
    @IsNotEmpty()
      type: LogType;

    @IsString()
    @IsNotEmpty()
      description: string;

    @IsString()
    @IsNotEmpty()
      entityName: string;

    @IsString()
    @IsNotEmpty()
      entityId: string;
}

export class UpdateLogDto extends PartialType(CreateLogDto) {}

export class LogDto extends CreateLogDto {
  logId: number;

  date: Date;

  userId: string;
}
