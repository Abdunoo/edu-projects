import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '../../database/database.module';
import { DbSchema } from '../../database/schema';
import { students } from '../../database/schema/students';
import { eq, aliasedTable, sql, and } from 'drizzle-orm';
import { CreateStudentDto } from './students.dto';
import { UpdateStudentDto } from './students.dto';
import { PaginationDto } from '../../common/types/pagination.dto';
import { PaginationResponse } from '../../common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '../../common/utils/filter-columns';
import { exportCsvUtil } from '../../common/utils/function.util';
import { handleServiceErrors } from '../../common/utils/error-handler';
import { Logger } from 'winston';
import { DashboardGateway } from '../../modules/dashboard/dashboard.gateway';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
    @Inject('winston')
    private readonly logger: Logger,
    private readonly dashboardGateway: DashboardGateway,
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
      this.dashboardGateway.triggerDashboardUpdate();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan siswa',
        data: row,
      };
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to create student',
      );
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
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to fetch students',
      );
    }
  }

  async list(paginationDto: PaginationDto): Promise<PaginationResponse<any>> {
    try {
      this.logger.info('Fetching list of students');
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
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to fetch list students',
      );
    }
  }

  async findOne(id: number) {
    try {
      const row = await this.db.query.students.findFirst({
        where: eq(students.id, id),
      });
      if (!row) throw new NotFoundException(`Student with ID ${id} not found`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil siswa',
        data: row,
      };
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to fetch student',
      );
    }
  }

  async update(id: number, dto: UpdateStudentDto) {
    try {
      const existingStudent = await this.findOne(id);
      if (!existingStudent)
        throw new NotFoundException(`Student with ID ${id} not found`);
      const updateData = {
        nisn: dto.nisn,
        name: dto.name,
        dob: dto.dob ? new Date(dto.dob) : undefined,
        guardianContact: dto.guardianContact,
        isActive: dto.isActive,
        updatedAt: new Date(),
      };
      const [row] = await this.db
        .update(students)
        .set(updateData)
        .where(eq(students.id, id))
        .returning();
      this.dashboardGateway.triggerDashboardUpdate();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate siswa',
        data: row,
      };
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to update student',
      );
    }
  }

  async remove(id: number) {
    try {
      const row = await this.findOne(id);
      await this.db.delete(students).where(eq(students.id, id));
      this.dashboardGateway.triggerDashboardUpdate();
      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menghapus siswa',
        data: row,
      };
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to delete student',
      );
    }
  }

  async exportCsv(paginationDto: PaginationDto) {
    try {
      const studentsColumns = [
        'id',
        'nisn',
        'name',
        'dob',
        'guardianContact',
        'createdAt',
        'updatedAt',
      ];
      const headerLabels = [
        'ID',
        'NISN',
        'Nama',
        'Tanggal Lahir',
        'Nomor Kontak Wali',
        'Dibuat Pada',
        'Diperbarui Pada',
      ];
      return exportCsvUtil(
        this.list.bind(this),
        paginationDto,
        studentsColumns,
        headerLabels,
      );
    } catch (e) {
      handleServiceErrors(
        e,
        this.logger,
        'StudentsService',
        'Failed to export students',
      );
    }
  }
}
