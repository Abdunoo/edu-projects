import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Logger } from 'winston';

export function handleServiceErrors(
  error: any,
  logger: Logger,
  serviceName: string,
  errorMessage: string,
): never {
  // If the error is already an HttpException
  if (error instanceof HttpException) {
    const status = error.getStatus();

    // Common errors to be logged as warnings (4xx client errors)
    const commonErrorCodes = [
      HttpStatus.BAD_REQUEST, // 400
      HttpStatus.UNAUTHORIZED, // 401
      HttpStatus.FORBIDDEN, // 403
      HttpStatus.NOT_FOUND, // 404
      HttpStatus.METHOD_NOT_ALLOWED, // 405
      HttpStatus.CONFLICT, // 409
      HttpStatus.UNPROCESSABLE_ENTITY, // 422
      HttpStatus.TOO_MANY_REQUESTS, // 429
    ];

    if (commonErrorCodes.includes(status)) {
      // Log common errors as warnings, not need to log stack trace
      logger.warn(`${errorMessage}: ${error.message}`, serviceName);
    } else {
      // Log uncommon HTTP errors as errors, need to log stack trace
      logger.error(
        `${errorMessage}: ${error.message}`,
        error.stack,
        serviceName,
      );
    }

    throw error;
  }

  // For non-HTTP errors (e.g., DB, logic), log as error and return a generic 500
  logger.error(
    `${errorMessage}: ${error.message || 'Unknown error'}`,
    error.stack,
    serviceName,
  );
  throw new InternalServerErrorException(errorMessage);
}
