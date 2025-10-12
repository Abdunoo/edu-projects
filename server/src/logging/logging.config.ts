import { WinstonModuleOptions } from 'nest-winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import * as fs from 'fs';
import * as path from 'path';

// Determine environment
const isDev = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Use /tmp for logs in serverless environments (Vercel)
const logDir = isProduction ? '/tmp/logs' : 'logs';

// Create logs directory if it doesn't exist and filesystem is writable
try {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
} catch (error) {
  // Ignore error in read-only filesystems (will use console only)
  console.warn('Unable to create log directory, file logging disabled');
}

// Build transports array
const transports: winston.transport[] = [
  // Console transport - always available
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
];

// Only add file transports in non-serverless environments
if (!isProduction || fs.existsSync(logDir)) {
  transports.push(
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
  );
}

export const loggingConfig: WinstonModuleOptions = {
  transports,
};
