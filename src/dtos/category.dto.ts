import { IsString, IsNotEmpty, Length } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

// DTO для создания
export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
      categoryName: string;

    @IsString()
    @IsNotEmpty()
      description: string;
}

// DTO для обновления на основе CreateCategoryDto
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

// DTO для ответа
export class CategoryDto extends CreateCategoryDto {
  categoryId: number;

  products?: any[]; // Опционально, если нужно возвращать связанные продукты
}
