# NestJS TypeScript Backend Template

A modern, production-ready backend template built with NestJS v11 and TypeScript, featuring Drizzle ORM for database management, JWT authentication, and comprehensive role-based access control (RBAC). This template provides a solid foundation for building scalable, secure, and maintainable backend applications.

## Features

- 🚀 **NestJS v11** - A progressive Node.js framework
- 📘 **TypeScript** - Full type safety and modern JavaScript features
- 💾 **Drizzle ORM** - Type-safe SQL query builder and ORM
- 🔐 **Authentication** - JWT-based auth with refresh tokens
- 🛡️ **RBAC Security** - Fine-grained permission-based access control
- 🌐 **API Documentation** - Swagger/OpenAPI integration
- 🔄 **Error Handling** - Comprehensive try-catch with proper error propagation
- ✅ **Testing Ready** - Jest configured for unit and e2e testing
- 🎨 **Code Quality** - ESLint and Prettier pre-configured
- 🔍 **Debugging** - VS Code debugging configuration included
- 🔒 **Environment Variables** - Secure configuration management
- 📊 **Database Migrations** - Automated schema migrations with Drizzle Kit
- 🚦 **Rate Limiting** - Built-in API rate limiting
- 📝 **Logging** - Structured logging with Winston

## Prerequisites

- Node.js ≥ 20.0.0
- npm or yarn
- PostgreSQL ≥ 15.0 (or your preferred database)

## Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run db:migrate
```

### Development

```bash
# Start development server
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Check linting
npm run lint

# Format code
npm run format

# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Start database studio
npm run db:studio
```

### Environment Variables

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Database Schema Management

This template uses Drizzle ORM for database operations and schema management. The schema is defined in TypeScript files under `src/database/schema/`.

```typescript
// Example schema definition
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### API Documentation

The API documentation is automatically generated using Swagger/OpenAPI. Once the server is running, you can access it at:

```
http://localhost:3001/docs
```

### Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── decorators/         # Custom decorators (@RequirePermissions)
│   ├── dto/               # Data transfer objects
│   ├── guards/            # Guards (JwtAuthGuard, PermissionsGuard)
│   ├── jwt/              # JWT strategy and configuration
│   └── zod/              # Zod validation schemas
├── common/               # Shared resources
│   ├── pipes/           # Custom pipes (ZodValidationPipe)
│   └── filters/         # Exception filters
├── database/            # Database configuration
│   ├── schema/          # Table definitions and relationships
│   └── seed.ts          # Database seeder
├── modules/             # Feature modules
│   ├── users/          # Users module (CRUD operations)
│   ├── roles/          # Roles and permissions
│   └── permissions/    # Permission definitions
├── app.module.ts       # Root application module
└── main.ts            # Application entry point
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Role-Based Access Control (RBAC)

This template implements a comprehensive RBAC system with fine-grained permissions:

```typescript
// Using the @RequirePermissions decorator
@RequirePermissions(Permission.USER_CREATE)
async create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

Permissions are defined as enums:
```typescript
export enum Permission {
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  USER_UPDATE = 'user:update',
  USER_DELETE = 'user:delete',
  // ... more permissions
}
```

### Permissions System

Permissions and Role-Permission mappings can be implemented in two ways:

1. **Database-driven (Dynamic)**:
   - Create tables: `permissions`, `roles_permissions`
   - Load mappings at runtime
   - Allows dynamic permission management

2. **Code-driven (Static)**:
   - Define permissions and mappings in code (current implementation)
   - Better type safety and performance
   - Changes require code deployment

### Error Handling

The template includes comprehensive error handling with proper error propagation:

```typescript
try {
  const user = await this.findOne(id);
  // ... perform operations
  return result;
} catch (error) {
  if (error instanceof UnauthorizedException) {
    throw error;
  }
  throw new BadRequestException('Operation failed');
}
```

Key features:
- Consistent error responses
- Proper error logging with Winston
- Error propagation with appropriate HTTP status codes
- Type-safe error handling

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.