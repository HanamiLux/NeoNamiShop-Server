import {IsInt, IsOptional} from "class-validator";
import {Type} from "class-transformer";

export class PaginationQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    take?: number = 10;

    get skip(): number {
        return (this.page - 1) * this.take;
    }
}