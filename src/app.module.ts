import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { config } from '@/config/ormconfig';
import { BackupService } from "@services/Backup.service";
import { AppController } from "@/controllers/app.controller";
import { AppService } from "@services/app.service";
import {Role} from "@entities/Role.entity";
import {Category} from "@entities/Category.entity";
import {Feedback} from "@entities/Feedback.entity";
import {User} from "@entities/User.entity";
import {Log} from "@entities/Log.entity";
import {Product} from "@entities/Product.entity";
import {Order} from "@entities/Order.entity";
import {OrderedProduct} from "@entities/OrderedProduct.entity";
import {LogService} from "@services/Log.service";
import {OrderedProductRepository} from "@/repositories/orderedProduct.repository";
import {ProductRepository} from "@/repositories/product.repository";
import {OrderRepository} from "@/repositories/order.repository";
import {CategoryRepository} from "@/repositories/category.repository";
import {FeedbackRepository} from "@/repositories/feedback.repository";
import {RoleRepository} from "@/repositories/role.repository";
import {RoleController} from "@/controllers/role.controller";
import {UserController} from "@/controllers/user.controller";
import {UserRepository} from "@/repositories/user.repository";
import {CategoryController} from "@/controllers/category.controller";
import {FeedbackController} from "@/controllers/feedback.controller";
import {LogController} from "@/controllers/log.controller";
import {OrderController} from "@/controllers/order.controller";
import {ProductController} from "@/controllers/product.controller";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        TypeOrmModule.forRootAsync(config),
        TypeOrmModule.forFeature([Role, Category, Feedback, User, Log, Product, Order, OrderedProduct]),
        ScheduleModule.forRoot(),
    ],
    providers: [AppService,
            BackupService,
            LogService,
            OrderedProductRepository,
            ProductRepository,
            OrderRepository,
            CategoryRepository,
            FeedbackRepository,
            RoleRepository,
            UserRepository],
    controllers: [AppController, RoleController, UserController, CategoryController, FeedbackController, LogController, OrderController, ProductController]
})
export class AppModule {}