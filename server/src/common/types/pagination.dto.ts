import { Table } from 'drizzle-orm';
import { FilterOperator, FilterVariant } from './data-table';
import z from 'zod';

export interface Filter {
  id: keyof Table;
  value: any;
  variant: FilterVariant;
  operator: FilterOperator;
  filterId?: string;
}

export interface Sort {
  id: string;
  desc: boolean;
}

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(10),
  filters: z
    .array(
      z.object({
        id: z.string(),
        value: z.any(),
        variant: z.enum([
          'text',
          'number',
          'date',
          'dateRange',
          'boolean',
          'range',
          'select',
          'multiSelect',
          'enum',
        ]),
        operator: z.enum([
          'eq',
          'ne',
          'gt',
          'gte',
          'lt',
          'lte',
          'iLike',
          'notILike',
          'inArray',
          'notInArray',
          'isBetween',
          'isRelativeToToday',
          'isEmpty',
          'isNotEmpty',
        ]),
      }),
    )
    .optional(),
  joinOperator: z.enum(['and', 'or']).default('and').optional(),
  sort: z
    .array(
      z.object({
        id: z.string(),
        desc: z.boolean().default(false),
      }),
    )
    .optional(),
});

export interface PaginationDto {
  page: number;
  perPage: number;
  filters?: Filter[]; // Changed from Filter to Filter[]
  joinOperator?: 'and' | 'or';
  sort?: Sort[];
}

// export interface PaginationParams {
//   page: number;
//   perPage: number;
//   filters?: Filter[];
//   joinOperator?: 'and' | 'or';
//   sort?: Sort[];
// }
