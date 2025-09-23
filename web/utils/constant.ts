// API Endpoints
export const API_BASE_URL = process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const ENDPOINTS = {
  AUTH: {
    PUBLIC: {
        LOGIN: '/api/auth/login',
        LOGOUT: '/api/auth/logout',
        ME: '/api/auth/me',
        REFRESH: '/api/auth/refresh',
        CSRF: '/api/auth/csrf',
      },
    PRIVATE: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      ME: '/auth/me',
      REFRESH: '/auth/refresh',
      CSRF: '/auth/csrf',
    },
  },
  USERS: {
    BASE: '/users',
    LIST: '/users/list',
    EXPORT: '/users/export',
  },
  ROLES: {
    BASE: '/roles',
    LIST: '/roles/list',
    EXPORT: '/roles/export',
  },
  STUDENTS: {
    BASE: '/students',
    LIST: '/students/list',
    EXPORT: '/students/export',
  },
  ENROLLMENTS: {
    BASE: '/enrollments',
    LIST: '/enrollments/list',
    EXPORT: '/enrollments/export',
  },
  GRADES: {
    BASE: '/grades',
    LIST: '/grades/list',
    EXPORT: '/grades/export',
  },
  CLASSES: {
    BASE: '/classes',
    LIST: '/classes/list',
    EXPORT: '/classes/export',
  },
  // Add more endpoints as needed
}

// Application constants
export const APP = {
  NAME: 'Nuxt 4 Starter',
  DESCRIPTION: 'A modern Nuxt 4 starter template with TypeScript, Tailwind CSS, and more',
  VERSION: '1.0.0',
}

// Local storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CSRF_TOKEN: 'csrf_token',
  USER: 'user',
}

// Routes that don't require authentication
export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password']

// Default page size for pagination
export const DEFAULT_PAGE_SIZE = 10

// Date and time formats
export const DATE_FORMATS = {
  DATE: 'YYYY-MM-DD',
  DATE_TIME: 'YYYY-MM-DD HH:mm',
  DATE_TIME_SECONDS: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm',
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection and try again.',
  SERVER: 'An unexpected error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check the form for errors.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
}

// Roles
export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
}
