import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v2');

  const configService = app.get(ConfigService);
  const allowedOrigins = configService.getOrThrow('CORS_ORIGINS').split(',').map((origin: string) => origin.trim());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  await app.listen(configService.getOrThrow('PORT'), '0.0.0.0');
}
bootstrap();
