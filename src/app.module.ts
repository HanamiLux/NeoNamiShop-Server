import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupService } from '@services/Backup.service';
import { AppService } from '@services/app.service';
import { Role } from '@entities/Role.entity';
import { Category } from '@entities/Category.entity';
import { Feedback } from '@entities/Feedback.entity';
import { User } from '@entities/User.entity';
import { Log } from '@entities/Log.entity';
import { Product } from '@entities/Product.entity';
import { Order } from '@entities/Order.entity';
import { OrderedProduct } from '@entities/OrderedProduct.entity';
import { config } from '@/config/ormconfig';
import { AppController } from '@/controllers/app.controller';
import { LogService } from '@services/Log.service';
import { OrderedProductRepository } from '@/repositories/orderedProduct.repository';
import { ProductRepository } from '@/repositories/product.repository';
import { OrderRepository } from '@/repositories/order.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { FeedbackRepository } from '@/repositories/feedback.repository';
import { RoleRepository } from '@/repositories/role.repository';
import { RoleController } from '@/controllers/role.controller';
import { UserController } from '@/controllers/user.controller';
import { UserRepository } from '@/repositories/user.repository';
import { CategoryController } from '@/controllers/category.controller';
import { FeedbackController } from '@/controllers/feedback.controller';
import { LogController } from '@/controllers/log.controller';
import { OrderController } from '@/controllers/order.controller';
import { ProductController } from '@/controllers/product.controller';
import { Repository } from 'typeorm';
import { ProductFeedbackStatistics } from '@entities/productFeedbackStatistics.entity';
import { ProductStatistics } from '@entities/productStatistics.entity';
import { MulterModule } from '@nestjs/platform-express';
import DatabaseBackupController from '@/controllers/admin.controller';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(config),
    TypeOrmModule.forFeature([Role, Category, Feedback, User, Log, Product, Order, OrderedProduct, ProductFeedbackStatistics, ProductStatistics]),
    MulterModule.register({
      dest: './uploads',
    }),
    ScheduleModule.forRoot(),
    MetricsModule,  // Добавляем модуль метрик
  ],
  providers: [
    AppService,
    BackupService,
    LogService,
    OrderedProductRepository,
    ProductRepository,
    OrderRepository,
    CategoryRepository,
    FeedbackRepository,
    RoleRepository,
    UserRepository,
    Repository<ProductFeedbackStatistics>,
    Repository<ProductStatistics>,
  ],
  controllers: [
    AppController,
    RoleController,
    UserController,
    CategoryController,
    FeedbackController,
    LogController,
    OrderController,
    ProductController,
    DatabaseBackupController,
  ],
})
export class AppModule {}
