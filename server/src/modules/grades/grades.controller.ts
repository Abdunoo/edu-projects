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
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { Permission } from '@/modules/permissions/permissions.enum';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  CreateGradeDto,
  UpdateGradeDto,
  createGradeSchema,
  updateGradeSchema,
} from './grades.dto';
import { PaginationDto, paginationSchema } from '@/common/types/pagination.dto';
import { CsrfGuard } from '@/auth/guards/csrf.guard';

@Controller('grades')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  @RequirePermissions(Permission.GRADE_CREATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  create(@Body(new ZodValidationPipe(createGradeSchema)) dto: CreateGradeDto) {
    return this.gradesService.create(dto);
  }

  @Get()
  @RequirePermissions(Permission.GRADE_READ)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.gradesService.findAll();
  }

  @Post('list')
  @RequirePermissions(Permission.GRADE_READ)
  @HttpCode(HttpStatus.OK)
  list(
    @Body(new ZodValidationPipe(paginationSchema)) paginationDto: PaginationDto,
  ) {
    return this.gradesService.list(paginationDto);
  }

  @Get('export')
  @RequirePermissions(Permission.GRADE_READ)
  @HttpCode(HttpStatus.OK)
  async export(@Res() res: Response) {
    const csv = await this.gradesService.exportCsv({
      page: 1,
      perPage: 100000,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="grades.csv"');
    return res.send(csv);
  }

  @Get(':id')
  @RequirePermissions(Permission.GRADE_READ)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gradesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.GRADE_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateGradeSchema)) dto: UpdateGradeDto,
  ) {
    return this.gradesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.GRADE_DELETE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gradesService.remove(id);
  }
}
