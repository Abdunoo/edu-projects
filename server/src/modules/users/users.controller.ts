import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  ParseIntPipe,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard';
import { PermissionsGuard } from '@/auth/guards/permissions.guard';
import { RequirePermissions } from '@/auth/decorators/permissions.decorator';
import type { CreateUserDto, UpdateUserDto } from './users.dto';
import { Permission } from '@/modules/permissions/permissions.enum';
import { PaginationDto, paginationSchema } from '@/common/types/pagination.dto';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { createUserSchema, updateUserSchema } from './users.dto';
import { CsrfGuard } from '@/auth/guards/csrf.guard';
import { Response } from 'express';
import {
  ResetPasswordDto,
  resetPasswordSchema,
} from '@/auth/dto/reset-password.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @RequirePermissions(Permission.USER_CREATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body(new ZodValidationPipe(createUserSchema)) createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions(Permission.USER_READ)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.usersService.findAll();
  }

  @Post('list')
  @RequirePermissions(Permission.USER_READ)
  @HttpCode(HttpStatus.OK)
  async list(
    @Body(new ZodValidationPipe(paginationSchema)) paginationDto: PaginationDto,
  ) {
    return this.usersService.findAllList(paginationDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.USER_READ)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.USER_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateUserSchema)) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.USER_DELETE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('export')
  @RequirePermissions(Permission.USER_READ)
  @HttpCode(HttpStatus.OK)
  async export(@Res() res: Response) {
    const csv = await this.usersService.exportCsv({
      page: 1,
      perPage: 100000,
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    return res.send(csv);
  }

  @Post('reset-password')
  @RequirePermissions(Permission.USER_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema))
    resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(resetPasswordDto);
  }
}
