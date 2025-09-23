import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '@/database/database.module';
import { DbSchema } from '@/database/schema';
import { classes } from '@/database/schema/classes';
import { CreateClassDto, UpdateClassDto } from './classes.dto';
import { PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '@/common/utils/filter-columns';
import { exportCsvUtil } from '@/common/utils/function.util';

@Injectable()
export class ClassesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
  ) {}

  async create(dto: CreateClassDto) {
    try {
      const [row] = await this.db
        .insert(classes)
        .values({
          name: dto.name,
          year: dto.year,
        })
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan kelas',
        data: row,
      };
    } catch (e) {
      throw new BadRequestException('Failed to create class');
    }
  }

  async findAll() {
    try {
      const rows = await this.db.query.classes.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar kelas',
        data: rows,
      };
    } catch (e) {
      throw new BadRequestException('Failed to fetch classes');
    }
  }

  async findAllList(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<any>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      const whereCondition = filterColumns({
        table: classes,
        filters,
        joinOperator,
        joinTables: {},
      });

      const orderBy = generateOrderBy({
        table: classes,
        sort,
        joinTables: {},
        defaultSortColumn: classes.updatedAt,
        isDesc: true,
      });

      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(classes)
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      const rows = await this.db.query.classes.findMany({
        where: whereCondition,
        orderBy,
        limit: perPage,
        offset,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar kelas',
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
    } catch (e) {
      throw new BadRequestException('Failed to fetch list classes');
    }
  }

  async findOne(id: number) {
    const row = await this.db.query.classes.findFirst({
      where: eq(classes.id, id),
    });
    if (!row) throw new NotFoundException(`Class with ID ${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil kelas',
      data: row,
    };
  }

  async update(id: number, dto: UpdateClassDto) {
    await this.findOne(id);
    try {
      const updateData = {
        name: dto.name,
        year: dto.year,
        updatedAt: new Date(),
      };
      const [row] = await this.db
        .update(classes)
        .set(updateData)
        .where(eq(classes.id, id))
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate kelas',
        data: row,
      };
    } catch (e) {
      throw new BadRequestException('Failed to update class');
    }
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.db.delete(classes).where(eq(classes.id, id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil menghapus kelas',
      data: row,
    };
  }

  async exportCsv(paginationDto: PaginationDto) {
    const classColumns = ['id', 'name', 'year', 'createdAt', 'updatedAt'];
    const headerLabels = [
      'ID',
      'Nama',
      'Tahun',
      'Dibuat Pada',
      'Diperbarui Pada',
    ];
    return exportCsvUtil(
      this.findAllList,
      paginationDto,
      classColumns,
      headerLabels,
    );
  }
}
