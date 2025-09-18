import { SQL, sql } from 'drizzle-orm';
import { AnyColumn } from 'drizzle-orm';

export function isEmpty<TColumn extends AnyColumn>(column: TColumn) {
  return sql<boolean>`
      case
        when ${column} is null then true
        when ${column} = '' then true
        when ${column}::text = '[]' then true
        when ${column}::text = '{}' then true
        else false
      end
    `;
}
