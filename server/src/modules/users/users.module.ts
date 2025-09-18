import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggingModule } from '@/logging/logging.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [DatabaseModule, LoggingModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
