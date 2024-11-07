import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { FeedbackRepository } from '@/repositories/feedback.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import { Feedback } from '@entities/Feedback.entity';
import { CreateFeedbackDto, UpdateFeedbackDto } from '@/dtos/feedback.dto';

@Controller('feedbacks')
export class FeedbackController {
    constructor(private readonly feedbackRepository: FeedbackRepository) {}

    @Get()
    async getFeedbacks(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: Feedback[], total: number }> {
        return await this.feedbackRepository.findAll(paginationQuery);
    }

    @Get(':id')
    async getFeedback(@Param('id', ParseUUIDPipe) id: number): Promise<Feedback> {
        const feedback = await this.feedbackRepository.findOne(id);
        if (!feedback) {
            throw new Error(`Feedback with ID ${id} not found`);
        }
        return feedback;
    }

    @Post()
    async createFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Feedback> {
        return await this.feedbackRepository.create(createFeedbackDto, userId);
    }

    @Put(':id')
    async updateFeedback(
        @Param('id', ParseUUIDPipe) id: number,
        @Body() updateFeedbackDto: UpdateFeedbackDto,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<Feedback> {
        return await this.feedbackRepository.update(id, updateFeedbackDto, userId);
    }

    @Delete(':id')
    async deleteFeedback(
        @Param('id', ParseUUIDPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<void> {
        await this.feedbackRepository.remove(id, userId);
    }
}