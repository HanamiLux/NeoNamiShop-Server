import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {DataSource} from "typeorm";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const dataSource = app.get(DataSource);
    console.log('База данных подключена:', dataSource.isInitialized);
    console.log('Список сущностей:', dataSource.entityMetadatas.map(entity => entity.name));
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
    }));

    app.enableCors();

    app.setGlobalPrefix('api/v1');

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('NEONAMI-API')
        .setDescription('Api documentation')
        .setVersion('1.0')
        // Add JWT bearer auth if you're using authentication
        // .addBearerAuth()
        // Add tags for API grouping if needed
        .addTag('products')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();