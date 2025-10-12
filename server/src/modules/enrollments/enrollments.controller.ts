import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Body,
  HttpCode,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { Permission } from '../../modules/permissions/permissions.enum';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateEnrollmentDto,
  UpdateEnrollmentDto,
  createEnrollmentSchema,
  updateEnrollmentSchema,
} from './enrollments.dto';
import { PaginationDto, paginationSchema } from '../../common/types/pagination.dto';
import { CsrfGuard } from '../../auth/guards/csrf.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @RequirePermissions(Permission.ENROLLMENT_CREATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  create(
    @Body(new ZodValidationPipe(createEnrollmentSchema))
    dto: CreateEnrollmentDto,
  ) {
    return this.enrollmentsService.create(dto);
  }

  @Get()
  @RequirePermissions(Permission.ENROLLMENT_READ)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.enrollmentsService.findAll();
  }

  @Post('list')
  @RequirePermissions(Permission.ENROLLMENT_READ)
  @HttpCode(HttpStatus.OK)
  list(
    @Body(new ZodValidationPipe(paginationSchema)) paginationDto: PaginationDto,
  ) {
    return this.enrollmentsService.list(paginationDto);
  }

  @Get('export')
  @RequirePermissions(Permission.ENROLLMENT_READ)
  @HttpCode(HttpStatus.OK)
  async export(@Res() res: Response) {
    const csv = await this.enrollmentsService.exportCsv({
      page: 1,
      perPage: 100000,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="enrollments.csv"',
    );
    return res.send(csv);
  }

  @Get(':id')
  @RequirePermissions(Permission.ENROLLMENT_READ)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.ENROLLMENT_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateEnrollmentSchema))
    dto: UpdateEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.ENROLLMENT_DELETE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.remove(id);
  }
}
