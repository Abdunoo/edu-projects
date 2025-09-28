import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { DashboardModule } from '@/modules/dashboard/dashboard.module';
import { DatabaseModule } from '@/database/database.module';
import { LoggingModule } from '@/logging/logging.module';

@Module({
  imports: [LoggingModule, DatabaseModule, DashboardModule],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService],
})
export class EnrollmentsModule {}
