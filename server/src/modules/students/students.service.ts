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
import { students } from '@/database/schema/students';
import { eq, aliasedTable, sql, and } from 'drizzle-orm';
import { CreateStudentDto } from './students.dto';
import { UpdateStudentDto } from './students.dto';
import { PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '@/common/utils/filter-columns';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
  ) {}

  async create(dto: CreateStudentDto) {
    try {
      const [row] = await this.db
        .insert(students)
        .values({
          nisn: dto.nisn,
          name: dto.name,
          dob: new Date(dto.dob),
          guardianContact: dto.guardianContact ?? null,
        })
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan siswa',
        data: row,
      };
    } catch (e) {
      throw new BadRequestException('Failed to create student');
    }
  }

  async findAll() {
    try {
      const rows = await this.db.query.students.findMany();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar siswa',
        data: rows,
      };
    } catch (e) {
      throw new BadRequestException('Failed to fetch students');
    }
  }

  async list(paginationDto: PaginationDto): Promise<PaginationResponse<any>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      const whereCondition = filterColumns({
        table: students,
        filters,
        joinOperator,
        joinTables: {},
      });

      const orderBy = generateOrderBy({
        table: students,
        sort,
        joinTables: {},
        defaultSortColumn: students.updatedAt,
        isDesc: true,
      });

      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(students)
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      const rows = await this.db.query.students.findMany({
        where: whereCondition,
        orderBy,
        limit: perPage,
        offset,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar siswa',
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
      throw new BadRequestException('Failed to fetch list students');
    }
  }

  async findOne(id: number) {
    const row = await this.db.query.students.findFirst({
      where: eq(students.id, id),
    });
    if (!row) throw new NotFoundException(`Student with ID ${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil siswa',
      data: row,
    };
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.findOne(id);
    try {
      const [row] = await this.db
        .update(students)
        .set({
          nisn: dto.nisn,
          name: dto.name,
          dob: dto.dob ? new Date(dto.dob) : undefined,
          guardianContact: dto.guardianContact,
        })
        .where(eq(students.id, id))
        .returning();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate siswa',
        data: row,
      };
    } catch (e) {
      throw new BadRequestException('Failed to update student');
    }
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.db.delete(students).where(eq(students.id, id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil menghapus siswa',
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
      'nisn',
      'name',
      'dob',
      'guardianContact',
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
      message: 'Berhasil mengambil daftar siswa',
      data: csv,
    };
  }
}
