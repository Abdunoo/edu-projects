import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '@/database/database.module';
import { DbSchema } from '@/database/schema';
import { grades } from '@/database/schema/grades';
import { eq, sql } from 'drizzle-orm';
import { CreateGradeDto, UpdateGradeDto } from './grades.dto';
import { PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '@/common/utils/filter-columns';

@Injectable()
export class GradesService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
  ) {}

  async create(dto: CreateGradeDto) {
    try {
      const [row] = await this.db
        .insert(grades)
        .values({
          studentId: dto.studentId,
          subject: dto.subject,
          term: dto.term,
          score: String(dto.score),
        })
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan nilai',
        data: row,
      };
    } catch {
      throw new BadRequestException('Failed to create grade');
    }
  }

  async findAll() {
    try {
      const rows = await this.db.query.grades.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar nilai',
        data: rows,
      };
    } catch {
      throw new BadRequestException('Failed to fetch grades');
    }
  }

  async list(paginationDto: PaginationDto): Promise<PaginationResponse<any>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      const whereCondition = filterColumns({
        table: grades,
        filters,
        joinOperator,
        joinTables: {},
      });

      const orderBy = generateOrderBy({
        table: grades,
        sort,
        joinTables: {},
        defaultSortColumn: grades.updatedAt,
        isDesc: true,
      });

      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(grades)
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      const rows = await this.db.query.grades.findMany({
        where: whereCondition,
        orderBy,
        limit: perPage,
        offset,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar nilai',
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
    } catch {
      throw new BadRequestException('Failed to fetch list grades');
    }
  }

  async findOne(id: number) {
    const row = await this.db.query.grades.findFirst({
      where: eq(grades.id, id),
    });
    if (!row) throw new NotFoundException(`Grade with ID ${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil nilai',
      data: row,
    };
  }

  async update(id: number, dto: UpdateGradeDto) {
    await this.findOne(id);
    try {
      const updateData = {
        studentId: dto.studentId,
        subject: dto.subject,
        term: dto.term,
        score: dto.score ? String(dto.score) : undefined,
        updatedAt: new Date(),
      };
      const [row] = await this.db
        .update(grades)
        .set(updateData)
        .where(eq(grades.id, id))
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate nilai',
        data: row,
      };
    } catch {
      throw new BadRequestException('Failed to update grade');
    }
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.db.delete(grades).where(eq(grades.id, id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil menghapus nilai',
      data: row,
    };
  }

  async exportCsv(paginationDto: PaginationDto) {
    const result = await this.list({
      ...paginationDto,
      page: 1,
      perPage: 100000,
    });
    const rows = result.data.rows as any[];
    const headers = [
      'id',
      'studentId',
      'subject',
      'term',
      'score',
      'createdAt',
      'updatedAt',
    ];
    const escape = (v: any) => {
      if (v === null || v === undefined) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const csv = [headers.join(',')]
      .concat(rows.map((r) => headers.map((h) => escape(r[h])).join(',')))
      .join('\n');
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil daftar nilai',
      data: csv,
    };
  }
}
