import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoggingModule } from '../../logging/logging.module';
import { DatabaseModule } from '../../database/database.module';
import { DashboardModule } from '../../modules/dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, LoggingModule, DashboardModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
