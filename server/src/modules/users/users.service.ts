import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from '@/database/database.module';
import { aliasedTable, eq, sql } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { ROLE_IDS } from '../roles/roles.enum';
import { DbSchema, roles } from '@/database/schema';
import {
  users,
  User,
  UserWithRole,
  UserListItem,
} from '@/database/schema/users';
import { Filter, PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';
import { filterColumns, generateOrderBy } from '@/common/utils/filter-columns';
import { handleServiceErrors } from '@/common/utils/error-handler';
import { Logger } from 'winston';
import { CreateUserDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<DbSchema>,
    @Inject('winston')
    private readonly logger: Logger,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Check if email already exists
      const existingUser = await this.db.query.users.findFirst({
        where: eq(users.email, createUserDto.email),
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Validate role ID (numeric)
      const roleId = createUserDto.roleId;
      if (
        roleId === undefined ||
        !Object.values(ROLE_IDS).includes(
          roleId as (typeof ROLE_IDS)[keyof typeof ROLE_IDS],
        )
      ) {
        throw new BadRequestException('Invalid role');
      }

      // Create user
      const [newUser] = await this.db
        .insert(users)
        .values({
          name: createUserDto.name,
          email: createUserDto.email,
          password: hashedPassword,
          roleId,
        })
        .returning();

      // Get user with role
      const userWithRole = await this.db.query.users.findFirst({
        where: eq(users.id, newUser.id),
        with: {
          role: true,
        },
      });

      if (!userWithRole) {
        throw new BadRequestException('Failed to create user');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menambahkan pengguna',
        data: userWithRole,
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to create user',
      );
    }
  }

  async findAll() {
    try {
      const users = await this.db.query.users.findMany({
        with: {
          role: true,
        },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar pengguna',
        data: users,
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to fetch users',
      );
    }
  }

  async findAllList(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<UserListItem>> {
    try {
      const { page, perPage, filters, joinOperator, sort } = paginationDto;
      const offset = (page - 1) * perPage;

      // Aliased users for self-join as roles and warehouse
      const roleAlias = aliasedTable(roles, 'role');

      // Build where condition using filterColumns function
      const whereCondition = filterColumns({
        table: users,
        filters: filters as Filter[],
        joinOperator,
        joinTables: { role: roleAlias },
      });

      // Build order by using generateOrderBy function
      const orderBy = generateOrderBy({
        table: users,
        sort,
        joinTables: { role: roleAlias },
        defaultSortColumn: users.updatedAt,
      });

      // Get total count
      const totalCountResult = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .leftJoin(roleAlias, eq(roleAlias.id, users.roleId))
        .where(whereCondition);

      const totalRows = Number(totalCountResult[0]?.count ?? 0);

      // Get paginated results
      const rows = await this.db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          roleId: users.roleId,
          isActive: users.isActive,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          role: {
            id: roleAlias.id,
            name: roleAlias.name,
          },
        })
        .from(users)
        .leftJoin(roleAlias, eq(roleAlias.id, users.roleId))
        .where(whereCondition)
        .limit(perPage)
        .offset(offset)
        .orderBy(...orderBy);

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil daftar pengguna',
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
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to fetch list users',
      );
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengambil data pengguna',
        data: user,
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to fetch user',
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.email) {
        const userWithEmail = await this.db.query.users.findFirst({
          where: eq(users.email, updateUserDto.email),
        });

        if (userWithEmail && userWithEmail.id !== id) {
          throw new ConflictException('Email already exists');
        }
      }

      if (
        updateUserDto.roleId !== undefined &&
        !Object.values(ROLE_IDS).includes(
          updateUserDto.roleId as (typeof ROLE_IDS)[keyof typeof ROLE_IDS],
        )
      ) {
        throw new BadRequestException('Invalid role');
      }

      const updateData: Partial<Pick<User, 'name' | 'email' | 'roleId'>> = {
        name: updateUserDto.name,
        email: updateUserDto.email,
      };
      if (updateUserDto.roleId !== undefined) {
        updateData.roleId = updateUserDto.roleId;
      }

      const [updatedUser] = await this.db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new BadRequestException('Failed to update user');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil mengupdate pengguna',
        data: updatedUser,
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to update user',
      );
    }
  }

  async remove(id: number) {
    try {
      const user = await this.db.query.users.findFirst({
        where: eq(users.id, id),
        with: {
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      await this.db.delete(users).where(eq(users.id, id));

      return {
        statusCode: HttpStatus.OK,
        message: 'Berhasil menghapus pengguna',
        data: user,
      };
    } catch (error) {
      handleServiceErrors(
        error,
        this.logger,
        'UsersService',
        'Failed to remove user',
      );
    }
  }
}
