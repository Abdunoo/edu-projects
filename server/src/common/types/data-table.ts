export type JoinOperator = 'and' | 'or';

export type FilterVariant =
  | 'text'
  | 'number'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'range'
  | 'select'
  | 'multiSelect'
  | 'enum';

export type FilterOperator =
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'iLike'
  | 'notILike'
  | 'inArray'
  | 'notInArray'
  | 'isBetween'
  | 'isRelativeToToday'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FilterItemSchema {
  value: any;
  operator: FilterOperator;
  variant: FilterVariant;
  filterId?: string;
}

export interface ExtendedColumnFilter<T> {
  id: any;
  value: any;
  operator: FilterOperator;
  variant: FilterVariant;
  filterId?: string;
}

export interface Option {
  label: string;
  value: string;
  count?: number;
}
