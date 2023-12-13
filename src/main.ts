import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: [
      'https://qulay-savdo.netlify.app',
      'http://localhost:5173',
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Prorab API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Users')
    .addTag('Auth')
    .addTag('Clients')
    .addTag('Category')
    .addTag('Units')
    .addTag('Items')
    .addTag('Payments')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(configService.get<number>('PORT'), () => {
    console.log('Web', configService.get<string>('BASE_URL'));
  });
}
bootstrap();
