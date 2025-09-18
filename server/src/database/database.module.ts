import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as schema from '@/database/schema';
import { LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (
        configService: ConfigService,
        logger: LoggerService,
      ) => {
        const client = new Client({
          connectionString: configService.get<string>('DATABASE_URL'),
        });

        await client.connect();
        const isDev = process.env.NODE_ENV === 'development';

        return drizzle(client, {
          schema,
          logger: isDev
            ? {
                logQuery(
                  query: string,
                  params: unknown[],
                  executionTime?: number,
                ) {
                  // Use Winston-powered Nest logger so logs flow to configured transports
                  logger.debug('DB QUERY', {
                    query,
                    params,
                    executionTime,
                  } as any);
                },
              }
            : false,
        });
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
