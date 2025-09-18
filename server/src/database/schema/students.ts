import {
  pgTable,
  serial,
  varchar,
  date,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { enrollments } from './enrollments';
import { grades } from './grades';
import { attendance } from './attendance';

export const students = pgTable('students', {
  id: serial('id').primaryKey(),
  nisn: varchar('nisn', { length: 30 }).unique().notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  dob: date('dob', { mode: 'date' }).notNull(),
  guardianContact: varchar('guardian_contact', { length: 120 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const studentsRelations = relations(students, ({ many }) => ({
  enrollments: many(enrollments),
  grades: many(grades),
  attendance: many(attendance),
}));

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
