import { PaginationDto } from '@/common/types/pagination.dto';
import { PaginationResponse } from '@/common/types/pagination-response.type';

export const exportCsvUtil = async (
  findAllList: (
    paginationDto: PaginationDto,
  ) => Promise<PaginationResponse<any>>,
  paginationDto: PaginationDto,
  columns: string[],
  headerLabels: string[],
) => {
  const result = await findAllList(paginationDto);
  const rows = result.data.rows as any[];

  const getByPath = (obj: any, path: string) =>
    path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

  const normalize = (v: any) => {
    if (v === null || v === undefined) return '';
    // serialize Date objects consistently
    if (v instanceof Date) return v.toISOString();
    return String(v);
  };

  const escape = (v: any) => {
    const s = normalize(v);
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? '"' + s.replace(/"/g, '""') + '"'
      : s;
  };

  const lines: string[] = [];
  lines.push(headerLabels.join(','));
  for (const r of rows) {
    const line = columns.map((col) => escape(getByPath(r, col))).join(',');
    lines.push(line);
  }

  return lines.join('\n');
};
