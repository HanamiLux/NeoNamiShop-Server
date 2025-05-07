import {
    IsString, IsNotEmpty, IsNumber, Min, Max, MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateFeedbackDto {
    @IsNumber()
    @Min(1)
    @Max(5)
      rate: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
      content: string;

    @IsNumber()
    @IsNotEmpty()
      productId: number;
}

export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}

export class FeedbackDto extends CreateFeedbackDto {
  feedbackId: number;

  date: Date;

  userId: string;

}
