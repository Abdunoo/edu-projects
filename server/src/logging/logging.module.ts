import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { loggingConfig } from './logging.config';

@Global()
@Module({
  imports: [WinstonModule.forRoot(loggingConfig)],
  exports: [WinstonModule],
})
export class LoggingModule {}
