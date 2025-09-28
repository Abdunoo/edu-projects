export enum Permission {
  USER_CREATE = "user:create",
  USER_READ = "user:read",
  USER_UPDATE = "user:update",
  USER_DELETE = "user:delete",

  PROFILE_READ = "profile:read",
  PROFILE_UPDATE = "profile:update",

  ROLE_CREATE = "role:create",
  ROLE_READ = "role:read",
  ROLE_UPDATE = "role:update",
  ROLE_DELETE = "role:delete",

  STUDENT_CREATE = "student:create",
  STUDENT_READ = "student:read",
  STUDENT_UPDATE = "student:update",
  STUDENT_DELETE = "student:delete",

  CLASS_CREATE = "class:create",
  CLASS_READ = "class:read",
  CLASS_UPDATE = "class:update",
  CLASS_DELETE = "class:delete",

  ENROLLMENT_CREATE = "enrollment:create",
  ENROLLMENT_READ = "enrollment:read",
  ENROLLMENT_UPDATE = "enrollment:update",
  ENROLLMENT_DELETE = "enrollment:delete",

  GRADE_CREATE = "grade:create",
  GRADE_READ = "grade:read",
  GRADE_UPDATE = "grade:update",
  GRADE_DELETE = "grade:delete",
}

export const ROLE_PERMISSIONS = {
  admin: Object.values(Permission),
  teacher: [
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.STUDENT_READ,
    Permission.CLASS_READ,
    Permission.ENROLLMENT_READ,
    Permission.GRADE_READ,
  ],
  student: [
    Permission.PROFILE_READ,
    Permission.PROFILE_UPDATE,
    Permission.STUDENT_READ,
    Permission.CLASS_READ,
    Permission.GRADE_READ,
  ],
} as const;

export type Role = keyof typeof ROLE_PERMISSIONS;
