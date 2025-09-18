import {
  type ExceptionFilter,
  Catch,
  type ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Logger } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
      error: exception.getResponse(),
    };

    // Log the error with context; this will go through Winston since we set useLogger
    this.logger.error(
      `HTTP ${status} on ${request.method} ${request.url}: ${exception.message}`,
      (exception as any).stack,
    );

    response.status(status).json(errorResponse);
  }
}
