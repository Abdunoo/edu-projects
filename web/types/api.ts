// Base response interface that can be extended by other API responses
export interface IBaseApiResponse<T> {
  status: number
  message: string
  data: T
}

// Interface for paginated data
export interface IPaginatedData<T> {
  rows: T[]
  meta: IPaginationMeta
}

// Interface for pagination metadata
export interface IPaginationMeta {
  page: number
  perPage: number
  totalRows: number
  totalPage: number
}

export interface IError {
  status: number
  message: string
}
