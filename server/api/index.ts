import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '../src/common/exceptions/http-exception.filter';

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api');
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // CORS configuration - allow Vercel frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL || '',
      /\.vercel\.app$/,
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  });
  
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
  
  await app.init();
  
  cachedApp = app;
  return app;
}

export default async (req: any, res: any) => {
  const app = await bootstrap();
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
};
