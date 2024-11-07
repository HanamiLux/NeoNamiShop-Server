import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateFeedbackDto {
    @IsNumber()
    @Min(1)
    @Max(5)
    rate: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    productId: number;
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}

export class FeedbackDto extends CreateFeedbackDto {
    feedbackId: string;
    date: Date;
    userId: string;
}