import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { Permission } from '../../modules/permissions/permissions.enum';
import type { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { RolesService } from './roles.service';
import { PaginationDto, paginationSchema } from '../../common/types/pagination.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CsrfGuard } from '../../auth/guards/csrf.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @RequirePermissions(Permission.ROLE_CREATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Get()
  @RequirePermissions(Permission.ROLE_READ)
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.rolesService.findAll();
  }

  @Post('list')
  @RequirePermissions(Permission.ROLE_READ)
  @HttpCode(HttpStatus.OK)
  async list(
    @Body(new ZodValidationPipe(paginationSchema)) paginationDto: PaginationDto,
  ) {
    return this.rolesService.findAllList(paginationDto);
  }

  @Get(':id')
  @RequirePermissions(Permission.ROLE_READ)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  @RequirePermissions(Permission.ROLE_UPDATE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions(Permission.ROLE_DELETE)
  @UseGuards(CsrfGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
