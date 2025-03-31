import { IsInt, IsOptional } from 'class-validator';

export class StatisticsQueryDto {
    @IsInt()
    @IsOptional()
    categoryId?: number;
}