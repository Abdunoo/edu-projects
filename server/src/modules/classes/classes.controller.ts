import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  CreateClassDto,
  UpdateClassDto,
  updateClassSchema,
} from './classes.dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createClassSchema } from './classes.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import { Permission } from '@/modules/permissions/permissions.enum';
import { CsrfGuard } from '@/auth/guards/csrf.guard';
import { PaginationDto, paginationSchema } from '@/common/types/pagination.dto';
import { ClassesService } from './classes.service';

@Controller('classes')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  @RequirePermissions(Permission.CLASS_CREATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  create(
    @Body(new ZodValidationPipe(createClassSchema))
    createClassDto: CreateClassDto,
  ) {
    return this.classesService.create(createClassDto);
  }

  @Post('list')
  @RequirePermissions(Permission.CLASS_READ)
  @HttpCode(HttpStatus.OK)
  list(
    @Body(new ZodValidationPipe(paginationSchema)) paginationDto: PaginationDto,
  ) {
    return this.classesService.findAllList(paginationDto);
  }

  @Get('export')
  @RequirePermissions(Permission.CLASS_READ)
  @HttpCode(HttpStatus.OK)
  async export(@Res() res: Response) {
    const csv = await this.classesService.exportCsv({
      page: 1,
      perPage: 100000,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="classes.csv"');
    return res.send(csv);
  }

  @Get()
  @RequirePermissions(Permission.CLASS_READ)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.classesService.findAll();
  }

  @Get(':id')
  @RequirePermissions(Permission.CLASS_READ)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.classesService.findOne(+id);
  }

  @Put(':id')
  @RequirePermissions(Permission.CLASS_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateClassSchema))
    updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.CLASS_DELETE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
