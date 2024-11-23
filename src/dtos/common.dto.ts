import { IsInt, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    take?: number;

    constructor() {
        this.page = this.page || 1;
        this.take = this.take || 10;
    }

    get skip(): number {
        return (this.page - 1) * this.take!;
    }
}
