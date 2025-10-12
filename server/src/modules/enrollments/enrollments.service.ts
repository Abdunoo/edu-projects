import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { classes, DbSchema, students } from '../../database/schema';
import { enrollments } from '../../database/schema/enrollments';
import { eq, sql } from 'drizzle-orm';
import { CreateEnrollmentDto, UpdateEnrollmentDto } from './enrollments.dto';
import { PaginationDto } from '../../common/types/pagination.dto';
import { PaginationResponse } from '../../common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '../../common/utils/filter-columns';
import { exportCsvUtil } from '../../common/utils/function.util';
import { Logger } from 'winston';
import { DashboardGateway } from '../../modules/dashboard/dashboard.gateway';
import { IDashboardUpdate } from '../../modules/dashboard/dashboard.dto';
import { handleServiceErrors } from '../../common/utils/error-handler';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
    private readonly dashboardGateway: DashboardGateway,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateEnrollmentDto) {
    try {
      const [row] = await this.db
        .insert(enrollments)
        .values({
          studentId: dto.studentId,
          classId: dto.classId,
        })
        .returning();
      this.dashboardGateway.triggerDashboardUpdate();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan enrollment',
        data: row,
      };
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'EnrollmentsService',
        'Failed to create enrollment',
      );
    }
  }

  async findAll() {
    try {
      const rows = await this.db.query.enrollments.findMany({
        with: {
          class: true,
          student: true,
        },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar enrollment',
        data: rows,
      };
    } catch {
      throw new BadRequestException('Failed to fetch enrollments');
    }
  }

  async list(paginationDto: PaginationDto): Promise<PaginationResponse<any>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      const whereCondition = filterColumns({
        table: enrollments,
        filters,
        joinOperator,
        joinTables: {
          class: classes,
          student: students,
        },
      });

      const orderBy = generateOrderBy({
        table: enrollments,
        sort,
        joinTables: {
          class: classes,
          student: students,
        },
        defaultSortColumn: enrollments.updatedAt,
        isDesc: true,
      });

      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(enrollments)
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      const rows = await this.db
        .select({
          id: enrollments.id,
          classId: enrollments.classId,
          studentId: enrollments.studentId,
          createdAt: enrollments.createdAt,
          updatedAt: enrollments.updatedAt,
          class: {
            id: classes.id,
            name: classes.name,
            year: classes.year,
            createdAt: classes.createdAt,
            updatedAt: classes.updatedAt,
          },
          student: {
            id: students.id,
            name: students.name,
            createdAt: students.createdAt,
            updatedAt: students.updatedAt,
          },
        })
        .from(enrollments)
        .leftJoin(classes, eq(enrollments.classId, classes.id))
        .leftJoin(students, eq(enrollments.studentId, students.id))
        .where(whereCondition)
        .limit(perPage)
        .offset(offset)
        .orderBy(...orderBy);

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar enrollment',
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
      throw new BadRequestException('Failed to fetch list enrollments');
    }
  }

  async findOne(id: number) {
    const row = await this.db.query.enrollments.findFirst({
      where: eq(enrollments.id, id),
      with: {
        class: true,
        student: true,
      },
    });
    if (!row) throw new NotFoundException(`Enrollment with ID ${id} not found`);
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil mengambil enrollment',
      data: row,
    };
  }

  async update(id: number, dto: UpdateEnrollmentDto) {
    await this.findOne(id);
    try {
      const [row] = await this.db
        .update(enrollments)
        .set({
          studentId: dto.studentId,
          classId: dto.classId,
        })
        .where(eq(enrollments.id, id))
        .returning();
      this.dashboardGateway.triggerDashboardUpdate();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate enrollment',
        data: row,
      };
    } catch {
      throw new BadRequestException('Failed to update enrollment');
    }
  }

  async remove(id: number) {
    const row = await this.findOne(id);
    await this.db.delete(enrollments).where(eq(enrollments.id, id));
    return {
      statusCode: HttpStatus.OK,
      message: 'Berhasil menghapus enrollment',
      data: row,
    };
  }

  async exportCsv(paginationDto: PaginationDto) {
    const columns = [
      'id',
      'class.name',
      'student.name',
      'createdAt',
      'updatedAt',
    ];
    const headerLabels = [
      'ID',
      'Kelas',
      'Siswa',
      'Dibuat Pada',
      'Diperbarui Pada',
    ];
    return exportCsvUtil(this.list, paginationDto, columns, headerLabels);
  }
}
