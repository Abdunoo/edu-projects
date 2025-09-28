import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { DatabaseModule } from '@/database/database.module';
import { LoggingModule } from '@/logging/logging.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [DatabaseModule, LoggingModule, DashboardModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
