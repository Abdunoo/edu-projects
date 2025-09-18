import {
  pgTable,
  serial,
  varchar,
  integer,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

export const auditLog = pgTable('audit_log', {
  id: serial('id').primaryKey(),
  entity: varchar('entity', { length: 100 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  userId: integer('user_id'),
  before: jsonb('before'),
  after: jsonb('after'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
