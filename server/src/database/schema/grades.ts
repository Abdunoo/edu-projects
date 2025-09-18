import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { students } from './students';

export const grades = pgTable(
  'grades',
  {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').notNull(),
    subject: varchar('subject', { length: 100 }).notNull(),
    term: varchar('term', { length: 50 }).notNull(),
    score: numeric('score', { precision: 5, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    uniqGrade: uniqueIndex('grades_student_subject_term_unique').on(
      table.studentId,
      table.subject,
      table.term,
    ),
  }),
);

export const gradesRelations = relations(grades, ({ one }) => ({
  student: one(students, {
    fields: [grades.studentId],
    references: [students.id],
  }),
}));

export type Grade = typeof grades.$inferSelect;
export type NewGrade = typeof grades.$inferInsert;
