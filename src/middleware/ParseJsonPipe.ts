import {BadRequestException, PipeTransform} from "@nestjs/common";

export class ParseJsonPipe implements PipeTransform {
    transform(value: string) {
        try {
            console.log('Raw value:', value); // Логируем входные данные
            const parsedValue = JSON.parse(value);
            console.log('Parsed value:', parsedValue); // Логируем результат парсинга

            // Дополнительная валидация полей
            if (!parsedValue.productName || !parsedValue.description ||
                !parsedValue.price || !parsedValue.quantity || !parsedValue.categoryId) {
                throw new BadRequestException('Missing required fields');
            }

            return parsedValue;
        } catch (e) {
            throw new BadRequestException('Invalid JSON format or missing required fields');
        }
    }
}