import { roles } from './roles';
import { users, usersRelations } from './users';
import { refreshTokens } from './refresh-tokens';
import { students, studentsRelations } from './students';
import { classes, classesRelations } from './classes';
import { enrollments, enrollmentsRelations } from './enrollments';
import { grades, gradesRelations } from './grades';
import { attendance, attendanceRelations } from './attendance';
import { auditLog } from './audit-log';

// Re-export everything for external use
export * from './roles';
export * from './users';
export * from './refresh-tokens';
export * from './students';
export * from './classes';
export * from './enrollments';
export * from './grades';
export * from './attendance';
export * from './audit-log';

// Schema for tables and relations
export const dbSchema = {
  users,
  roles,
  refreshTokens,
  usersRelations,
  students,
  studentsRelations,
  classes,
  classesRelations,
  enrollments,
  enrollmentsRelations,
  grades,
  gradesRelations,
  attendance,
  attendanceRelations,
  auditLog,
};

export type DbSchema = typeof dbSchema;
