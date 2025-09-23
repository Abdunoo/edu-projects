import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '@/database/database.module';
import { DbSchema, roles, Role } from '@/database/schema';
import { eq, sql } from 'drizzle-orm';
import type { CreateRoleDto, UpdateRoleDto } from './roles.dto';
import { PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '@/common/utils/filter-columns';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
  ) {}

  async create(dto: CreateRoleDto) {
    try {
      const existing = await this.db.query.roles.findFirst({
        where: eq(roles.name, dto.name),
      });
      if (existing) {
        throw new ConflictException('Role name already exists');
      }

      const [created] = await this.db
        .insert(roles)
        .values({ name: dto.name })
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan peran',
        data: created,
      };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new BadRequestException('Failed to create role');
    }
  }

  async findAll() {
    try {
      const rows = await this.db.query.roles.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar peran',
        data: rows,
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch roles');
    }
  }

  async findAllList(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Role>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      const whereCondition = filterColumns({
        table: roles,
        filters,
        joinOperator,
        joinTables: {},
      });

      const orderBy = generateOrderBy({
        table: roles,
        sort,
        joinTables: {},
        defaultSortColumn: roles.id,
      });

      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(roles)
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      const rows = await this.db
        .select({
          id: roles.id,
          name: roles.name,
        })
        .from(roles)
        .where(whereCondition)
        .limit(perPage)
        .offset(offset)
        .orderBy(...orderBy);

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar peran',
        data: {
          rows,
          meta: {
            page,
            perPage,
            totalRows,
            totalPage: Math.ceil(totalRows / perPage),
          },
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to fetch list roles');
    }
  }

  async findOne(id: number) {
    try {
      const role = await this.db.query.roles.findFirst({
        where: eq(roles.id, id),
      });
      if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil peran',
        data: role,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to fetch role');
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    try {
      if (dto.name) {
        const existing = await this.db.query.roles.findFirst({
          where: eq(roles.name, dto.name),
        });
        if (existing && existing.id !== id) {
          throw new ConflictException('Role name already exists');
        }
      }

      const updateData = {
        name: dto.name,
        updatedAt: new Date(),
      };

      const [updated] = await this.db
        .update(roles)
        .set(updateData)
        .where(eq(roles.id, id))
        .returning();

      if (!updated) throw new BadRequestException('Failed to update role');
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate peran',
        data: updated,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new BadRequestException('Failed to update role');
    }
  }

  async remove(id: number) {
    try {
      const role = await this.db.query.roles.findFirst({
        where: eq(roles.id, id),
      });
      if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

      await this.db.delete(roles).where(eq(roles.id, id));
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menghapus peran',
        data: role,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException('Failed to remove role');
    }
  }
}
