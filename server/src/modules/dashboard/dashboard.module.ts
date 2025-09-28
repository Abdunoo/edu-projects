import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { LoggingModule } from '@/logging/logging.module';
import { DatabaseModule } from '@/database/database.module';

@Module({
  imports: [LoggingModule, DatabaseModule],
  providers: [DashboardGateway, DashboardService],
  exports: [DashboardGateway, DashboardService],
})
export class DashboardModule {}
