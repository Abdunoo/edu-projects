import { BadRequestException } from '@nestjs/common';
import { addDays, endOfDay, startOfDay } from 'date-fns';
import {
  type AnyColumn,
  type SQL,
  type Table,
  and,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  not,
  notIlike,
  notInArray,
  or,
  desc,
  asc,
} from 'drizzle-orm';
import {
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
  JoinOperator,
} from '../types/data-table';
import { isEmpty } from './db-utils';

/**
 * Generates SQL conditions based on column filters for database queries.
 *
 * This function transforms an array of column filters into SQL conditions that can be used
 * in database queries. It supports various filter operators for different data types including
 * text, numbers, dates, booleans, and arrays.
 *
 * @param options - Configuration options
 * @param options.table - The database table to filter
 * @param options.filters - Array of column filters to apply
 * @param options.joinOperator - How to join multiple conditions ('and'/'or')
 * @returns SQL condition or undefined if no valid conditions are generated
 *
 * @example
 * // Filter tasks where status equals 'completed' AND priority is greater than 2
 * const conditions = filterColumns({
 *   table: tasksTable,
 *   filters: [
 *     { id: 'status', operator: 'eq', value: 'completed', variant: 'text' },
 *     { id: 'priority', operator: 'gt', value: 2, variant: 'number' }
 *   ],
 *   joinOperator: 'and'
 * });
 */
export function filterColumns<T extends Table>({
  table,
  filters = [],
  joinOperator = 'and',
  joinTables = {}, // Menambahkan joinTables sebagai parameter
}: {
  table: T;
  filters: Array<{
    id: keyof T;
    value: any;
    variant: FilterVariant;
    operator: FilterOperator;
    filterId?: string;
  }>;
  joinOperator: JoinOperator;
  joinTables: { [key: string]: Table }; // Tabel-tabel yang dijoin
}): SQL | undefined {
  const joinFn = joinOperator === 'and' ? and : or;

  const validFilters = filters.filter(
    (filter): filter is ExtendedColumnFilter<T> => {
      return (
        filter.id != null && filter.operator != null && filter.variant != null
      );
    },
  );

  const conditions = validFilters.map((filter) => {
    const columnName = filter.id.toString();
    let column: AnyColumn | undefined;

    // Jika kolom berasal dari tabel yang dijoin, kita ambil dari joinTables
    if (columnName.includes('.')) {
      const [tableName, columnKey] = columnName.split('.');
      const joinedTable = joinTables[tableName];

      if (joinedTable) {
        column = joinedTable[
          columnKey as keyof typeof joinedTable
        ] as AnyColumn;
      } else {
        throw new BadRequestException(
          `Tabel ${tableName} tidak ditemukan di joinTables`,
        );
      }
    } else {
      // Jika kolom berasal dari tabel utama
      column = table[filter.id];
    }
    switch (filter.operator) {
      case 'iLike':
        return filter.variant === 'text' && typeof filter.value === 'string'
          ? ilike(column, `%${filter.value}%`)
          : undefined;

      case 'notILike':
        return filter.variant === 'text' && typeof filter.value === 'string'
          ? notIlike(column, `%${filter.value}%`)
          : undefined;

      case 'eq':
        if (column.dataType === 'boolean' && typeof filter.value === 'string') {
          return eq(column, filter.value === 'true');
        }
        if (filter.variant === 'date' || filter.variant === 'dateRange') {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return and(gte(column, date), lte(column, end));
        }
        return eq(column, filter.value);

      case 'ne':
        if (column.dataType === 'boolean' && typeof filter.value === 'string') {
          return ne(column, filter.value === 'true');
        }
        if (filter.variant === 'date' || filter.variant === 'dateRange') {
          const date = new Date(Number(filter.value));
          date.setHours(0, 0, 0, 0);
          const end = new Date(date);
          end.setHours(23, 59, 59, 999);
          return or(lt(column, date), gt(column, end));
        }
        return ne(column, filter.value);

      case 'inArray':
        if (Array.isArray(filter.value)) {
          return inArray(column, filter.value);
        }
        return undefined;

      case 'notInArray':
        if (Array.isArray(filter.value)) {
          return notInArray(column, filter.value);
        }
        return undefined;

      case 'lt':
        return filter.variant === 'number' || filter.variant === 'range'
          ? lt(column, filter.value)
          : filter.variant === 'date' && typeof filter.value === 'string'
            ? lt(
                column,
                (() => {
                  const date = new Date(Number(filter.value));
                  date.setHours(23, 59, 59, 999);
                  return date;
                })(),
              )
            : undefined;

      case 'lte':
        return filter.variant === 'number' || filter.variant === 'range'
          ? lte(column, filter.value)
          : filter.variant === 'date' && typeof filter.value === 'string'
            ? lte(
                column,
                (() => {
                  const date = new Date(Number(filter.value));
                  date.setHours(23, 59, 59, 999);
                  return date;
                })(),
              )
            : undefined;

      case 'gt':
        return filter.variant === 'number' || filter.variant === 'range'
          ? gt(column, filter.value)
          : filter.variant === 'date' && typeof filter.value === 'string'
            ? gt(
                column,
                (() => {
                  const date = new Date(Number(filter.value));
                  date.setHours(0, 0, 0, 0);
                  return date;
                })(),
              )
            : undefined;

      case 'gte':
        return filter.variant === 'number' || filter.variant === 'range'
          ? gte(column, filter.value)
          : filter.variant === 'date' && typeof filter.value === 'string'
            ? gte(
                column,
                (() => {
                  const date = new Date(Number(filter.value));
                  date.setHours(0, 0, 0, 0);
                  return date;
                })(),
              )
            : undefined;

      case 'isBetween':
        if (
          (filter.variant === 'date' || filter.variant === 'dateRange') &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          return and(
            filter.value[0]
              ? gte(
                  column,
                  (() => {
                    const date = new Date(Number(filter.value[0]));
                    date.setHours(0, 0, 0, 0);
                    return date;
                  })(),
                )
              : undefined,
            filter.value[1]
              ? lte(
                  column,
                  (() => {
                    const date = new Date(Number(filter.value[1]));
                    date.setHours(23, 59, 59, 999);
                    return date;
                  })(),
                )
              : undefined,
          );
        }

        if (
          (filter.variant === 'number' || filter.variant === 'range') &&
          Array.isArray(filter.value) &&
          filter.value.length === 2
        ) {
          const firstValue =
            filter.value[0] && filter.value[0].trim() !== ''
              ? Number(filter.value[0])
              : null;
          const secondValue =
            filter.value[1] && filter.value[1].trim() !== ''
              ? Number(filter.value[1])
              : null;

          if (firstValue === null && secondValue === null) {
            return undefined;
          }

          if (firstValue !== null && secondValue === null) {
            return eq(column, firstValue);
          }

          if (firstValue === null && secondValue !== null) {
            return eq(column, secondValue);
          }

          return and(
            firstValue !== null ? gte(column, firstValue) : undefined,
            secondValue !== null ? lte(column, secondValue) : undefined,
          );
        }
        return undefined;

      case 'isRelativeToToday':
        if (
          (filter.variant === 'date' || filter.variant === 'dateRange') &&
          typeof filter.value === 'string'
        ) {
          const today = new Date();
          const [amount, unit] = filter.value.split(' ') ?? [];
          let startDate: Date;
          let endDate: Date;

          if (!amount || !unit) return undefined;

          switch (unit) {
            case 'days':
              startDate = startOfDay(addDays(today, Number.parseInt(amount)));
              endDate = endOfDay(startDate);
              break;
            case 'weeks':
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 7),
              );
              endDate = endOfDay(addDays(startDate, 6));
              break;
            case 'months':
              startDate = startOfDay(
                addDays(today, Number.parseInt(amount) * 30),
              );
              endDate = endOfDay(addDays(startDate, 29));
              break;
            default:
              return undefined;
          }

          return and(gte(column, startDate), lte(column, endDate));
        }
        return undefined;

      case 'isEmpty':
        return isEmpty(column);

      case 'isNotEmpty':
        return not(isEmpty(column));

      default:
        throw new Error(`Unsupported operator: ${filter.operator}`);
    }
  });

  const validConditions = conditions.filter(
    (condition) => condition !== undefined,
  );

  return validConditions.length > 0 ? joinFn(...validConditions) : undefined;
}

export function getColumn<T extends Table>(
  table: T,
  columnKey: keyof T,
): AnyColumn {
  return table[columnKey] as AnyColumn;
}

export function generateOrderBy<T extends Table>({
  table,
  sort = [],
  joinTables = {},
  defaultSortColumn,
  isDesc = true,
}: {
  table: T;
  sort: Array<{
    id: string;
    desc: boolean;
  }>;
  joinTables: { [key: string]: Table };
  defaultSortColumn?: AnyColumn;
  isDesc?: boolean;
}): SQL[] {
  if (!sort.length) {
    if (!defaultSortColumn) {
      throw new BadRequestException(
        'Default sort column is required when no sort is provided',
      );
    }
    return [isDesc ? desc(defaultSortColumn) : asc(defaultSortColumn)];
  }

  return sort.map(({ id, desc: isDesc }) => {
    // Check if the column is from a joined table
    if (id.includes('.')) {
      const [tableName, columnKey] = id.split('.');
      const joinedTable = joinTables[tableName];

      if (!joinedTable) {
        throw new BadRequestException(
          `Table ${tableName} not found in joinTables`,
        );
      }

      const column = joinedTable[
        columnKey as keyof typeof joinedTable
      ] as AnyColumn;
      return isDesc ? desc(column) : asc(column);
    }

    // Handle main table column
    const column = table[id as keyof T] as AnyColumn;
    return isDesc ? desc(column) : asc(column);
  });
}
