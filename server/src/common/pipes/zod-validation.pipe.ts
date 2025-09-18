import { InternalServerErrorException } from '@nestjs/common';
import {
  type PipeTransform,
  Injectable,
  type ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodError, type ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error: any) {
      if (error instanceof ZodError) {
        // Format Zod validation errors
        const errors = {
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          errors: error.issues.map((err: any) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        };
        throw new BadRequestException(errors);
      }
      throw new InternalServerErrorException('Validation failed');
    }
  }
}
