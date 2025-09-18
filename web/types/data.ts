import type { IUser } from '~~/schemas/user.schema';
import type { IBaseApiResponse } from './api';



export type IStudentFilters = {
  name: string
  classId: string
  status: string
}

export type IStudentTableParams = IPaginationParams & IStudentFilters & ISortParams

export type IPaginationParams = {
  page: number
  perPage: number
}

export type ISortParams = {
  sort_by: string
  sort_dir: 'asc' | 'desc'
}

// ---- Generic, reusable table request types (payload contract) ----
export type FilterVariant =
  | 'text'
  | 'number'
  | 'range'
  | 'date'
  | 'dateRange'
  | 'boolean'
  | 'select'
  | 'multiSelect'

export type FilterOperator =
  | 'iLike'
  | 'notILike'
  | 'eq'
  | 'ne'
  | 'inArray'
  | 'notInArray'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'lt'
  | 'lte'
  | 'gt'
  | 'gte'
  | 'isBetween'
  | 'isRelativeToToday'

export type JoinOperator = 'and' | 'or'

export type FilterCondition = {
  id: string // column path e.g. "role.name"
  value: unknown
  variant: FilterVariant
  operator: FilterOperator
  filterId?: string
}

export type SortItem = {
  id: string
  desc: boolean
}

export type ListRequestPayload = {
  page: number
  perPage: number
  filters?: FilterCondition[]
  joinOperator?: JoinOperator
  sort?: SortItem[]
}

export type ListResponseData<T> = {
  rows: T[]
  totalRows: number
  pageCount: number
}

export type IListResponse<T> = IBaseApiResponse<ListResponseData<T>>

// Special column keys that aren't part of the data model
type SpecialColumnKey = 'actions'

type ColumnValue = string | number | boolean | Record<string, unknown> | undefined

export interface ITableColumn<T = Record<string, unknown>> {
  key: string | keyof T | SpecialColumnKey
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (value: ColumnValue) => string | number | boolean
}

export type ISelectOption = {
  label: string
  value: string
}

export type IRole = {
  id: number | string
  name: string
}

export type IUserFilters = {
  name: string
  role: IRole
  status: string
}

export type IUserTableParams = IPaginationParams & IUserFilters & ISortParams

export type IAuthLogin = {
  user: IUser
  access_token: string
  refresh_token: string
}

export type IAuthLoginRequest = {
  email: string
  password: string
}

export type ICSRF = {
  csrf_token: string
}

export type IAuthRegisterRequest = {
  name: string
  email: string
  password: string
  role: IRole
}

export type IAuthRefresh = {
  access_token: string
  refresh_token: string
}
