import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  // Buffer logs during bootstrap so early logs are not lost
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // Use Winston as the Nest logger so all framework logs (including errors) go through Winston
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // Set global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global exception filter for consistent error logging and responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS configuration
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
  ].filter(Boolean);
  
  // Allow Vercel preview and production URLs
  const corsOptions = {
    origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  };
  
  app.enableCors(corsOptions);

  // Cookie parser for reading JWT and CSRF cookies
  app.use(cookieParser());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS TypeScript Starter API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(
    `📚 API Documentation available at: http://localhost:${port}/docs`,
  );
}

bootstrap();
