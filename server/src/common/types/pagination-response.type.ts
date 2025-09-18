export interface PaginationMeta {
  page: number;
  perPage: number;
  totalRows: number;
  totalPage: number;
}

export interface PaginationResponse<T> {
  statusCode: number;
  message: string;
  data: {
    rows: T[];
    meta: PaginationMeta;
  };
}

// Type guard to check if response is paginated
export function isPaginatedResponse<T>(
  response: any,
): response is PaginationResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    'data' in response &&
    'rows' in response.data &&
    'meta' in response.data &&
    'page' in response.data.meta &&
    'perPage' in response.data.meta &&
    'totalRows' in response.data.meta &&
    'totalPage' in response.data.meta
  );
}
