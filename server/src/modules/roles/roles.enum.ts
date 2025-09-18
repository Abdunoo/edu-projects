export enum UserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
}

export const ROLE_IDS = {
  [UserRole.ADMIN]: 1,
  [UserRole.TEACHER]: 2,
  [UserRole.STUDENT]: 3,
} as const;
