import {
  Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query,
} from '@nestjs/common';
import { Feedback } from '@entities/Feedback.entity';
import { FeedbackRepository } from '@/repositories/feedback.repository';
import { PaginationQueryDto } from '@/dtos/common.dto';
import {CreateFeedbackDto, FeedbackDto, UpdateFeedbackDto} from '@/dtos/feedback.dto';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

    @Get()
  async getFeedbacks(@Query() paginationQuery: PaginationQueryDto): Promise<{ items: FeedbackDto[], total: number }> {
    return await this.feedbackRepository.findAll(paginationQuery);
  }

    @Get(':id')
    async getFeedback(@Param('id', ParseIntPipe) id: number): Promise<Feedback> {
      const feedback = await this.feedbackRepository.findOneById(id);
      if (!feedback) {
        throw new Error(`Feedback with ID ${id} not found`);
      }
      return feedback;
    }

    @Get('product/:productId')
    async getFeedbacksByProduct(
        @Param('productId', ParseIntPipe) productId: number,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<{ items: FeedbackDto[], total: number }> {
      return await this.feedbackRepository.findByProduct(productId, paginationQuery);
    }

    @Get('user/:userId')
    async getFeedbacksByUser(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Query() paginationQuery: PaginationQueryDto,
    ): Promise<{ items: Feedback[], total: number }> {
      return await this.feedbackRepository.findByUser(userId, paginationQuery);
    }

  @Post()
  async createFeedback(
      @Body() createFeedbackDto: CreateFeedbackDto,
      @Query('userId', ParseUUIDPipe) userId: string,
  ): Promise<Feedback> {
    try {
      return await this.feedbackRepository.create({
        ...createFeedbackDto,
        userId: userId
      }, userId);
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw new HttpException(
          'Failed to create feedback: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

    @Put(':id')
    async updateFeedback(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateFeedbackDto: UpdateFeedbackDto,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<Feedback> {
      return await this.feedbackRepository.update(id, updateFeedbackDto, userId);
    }

    @Delete(':id')
    async deleteFeedback(
        @Param('id', ParseIntPipe) id: number,
        @Query('userId', ParseUUIDPipe) userId: string,
    ): Promise<void> {
      await this.feedbackRepository.remove(id, userId);
    }
}
