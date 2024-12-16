import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const dataSource = app.get(DataSource);
  console.log('База данных подключена:', dataSource.isInitialized);
  console.log('Список сущностей:', dataSource.entityMetadatas.map((entity) => entity.name));

  // Настраиваем раздачу статических файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Преобразует входные данные в соответствующие типы
    whitelist: true, // Удаляет невалидные поля
    forbidNonWhitelisted: true, // Запрещает невалидные поля
    exceptionFactory: (errors) => {
      const messages = errors.map((error) => ({
        field: error.property,
        errors: Object.values(error.constraints),
      }));
      return new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: messages,
      });
    },
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
