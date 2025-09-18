import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { enrollments } from './enrollments';
import { attendance } from './attendance';

export const classes = pgTable('classes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const classesRelations = relations(classes, ({ many }) => ({
  enrollments: many(enrollments),
  attendance: many(attendance),
}));

export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
