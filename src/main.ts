import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { PrometheusService } from '@/metrics/prometheus.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const dataSource = app.get(DataSource);
  const prometheusService = app.get(PrometheusService);

  console.log('База данных подключена:', dataSource.isInitialized);
  console.log('Список сущностей:', dataSource.entityMetadatas.map((entity) => entity.name));

  // Настраиваем раздачу статических файлов
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' });

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
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

  // Middleware для отслеживания метрик запросов
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      prometheusService.trackRequest();
      prometheusService.recordResponseTime(duration);
    });
    next();
  });

  // Запускаем обновление метрики активных заказов каждые 30 секунд
  setInterval(async () => {
    await prometheusService.updateActiveOrders();
  }, 30000);

  // Swagger
  const config = new DocumentBuilder()
      .setTitle('NEONAMI-API')
      .setDescription('Api documentation')
      .setVersion('1.0')
      .addTag('products')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3003);
}

bootstrap();
