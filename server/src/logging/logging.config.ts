import { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

// Create logs directory if it doesn't exist
import * as fs from 'fs';
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Determine environment
const isDev = process.env.NODE_ENV === 'development';

export const loggingConfig: WinstonModuleOptions = {
  level: isDev ? 'debug' : 'debug', // Keep debug as base; transport levels will gate outputs
  transports: [
    // Console transport - shows all levels with colors
    new winston.transports.Console({
      level: isDev ? 'debug' : 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('NestJS', {
          prettyPrint: true,
          colors: true,
        }),
      ),
    }),
    // Error file - only logs error and above (error, fatal)
    new winston.transports.File({
      dirname: logDir,
      filename: 'error.log',
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    // Combined file - logs warn and above (warn, error, fatal)
    new winston.transports.File({
      dirname: logDir,
      filename: 'combined.log',
      level: isDev ? 'debug' : 'warn',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      tailable: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
