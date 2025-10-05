# Contributing to Educational Management System

Thank you for your interest in contributing to the Educational Management System! This document provides guidelines and instructions for contributing to this project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect all participants to:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js ≥ 20.0.0
- npm, yarn, or pnpm
- PostgreSQL ≥ 15.0
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository**
   
   Click the "Fork" button on GitHub to create your own copy of the repository.

2. **Clone your fork**
   
   ```bash
   git clone https://github.com/YOUR_USERNAME/edu-projects.git
   cd edu-projects
   ```

3. **Add upstream remote**
   
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/edu-projects.git
   ```

4. **Install dependencies**
   
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../web
   npm install
   ```

5. **Set up environment variables**
   
   ```bash
   # Backend
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   
   # Frontend
   cd ../web
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Set up the database**
   
   ```bash
   cd server
   npm run db:push
   npm run db:seed  # Optional: seed with sample data
   ```

7. **Start development servers**
   
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run start:dev
   
   # Terminal 2 - Frontend
   cd web
   npm run dev
   ```

## 💻 Development Workflow

### Branching Strategy

We use a feature branch workflow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in your feature branch
2. Test your changes thoroughly
3. Ensure all tests pass
4. Update documentation if needed
5. Commit your changes following our commit guidelines

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Avoid `any` types - use proper typing

### Backend (NestJS)

- Follow NestJS best practices
- Use dependency injection
- Implement proper error handling with try-catch blocks
- Use DTOs for request validation
- Add Swagger decorators for API documentation
- Write unit tests for services
- Write e2e tests for controllers

Example:
```typescript
@Post()
@RequirePermissions(Permission.USER_CREATE)
@ApiOperation({ summary: 'Create a new user' })
@ApiResponse({ status: 201, description: 'User created successfully' })
async create(@Body() createUserDto: CreateUserDto) {
  try {
    return await this.usersService.create(createUserDto);
  } catch (error) {
    throw new BadRequestException('Failed to create user');
  }
}
```

### Frontend (Nuxt.js)

- Use Composition API with `<script setup>`
- Follow Vue 3 best practices
- Use TypeScript for type safety
- Implement proper error handling
- Use Nuxt UI components when possible
- Make components reusable and composable
- Add proper loading and error states

Example:
```vue
<script setup lang="ts">
const { data, pending, error } = await useFetch('/api/users');
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
  </div>
</template>
```

### Code Formatting

We use ESLint and Prettier for code formatting:

```bash
# Backend
cd server
npm run lint
npm run format

# Frontend
cd web
npm run lint
npm run format
```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

### Examples

```bash
feat(users): add user profile page

fix(auth): resolve token refresh issue

docs(readme): update installation instructions

test(students): add unit tests for student service
```

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run tests**
   ```bash
   # Backend
   cd server
   npm run test
   npm run test:e2e
   
   # Frontend
   cd web
   npm run lint
   ```

3. **Build the project**
   ```bash
   # Backend
   cd server
   npm run build
   
   # Frontend
   cd web
   npm run build
   ```

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin your-feature-branch
   ```

2. Go to the original repository on GitHub

3. Click "New Pull Request"

4. Select your fork and branch

5. Fill out the PR template:
   - **Title**: Clear, concise description
   - **Description**: Detailed explanation of changes
   - **Related Issues**: Link any related issues
   - **Screenshots**: Add if UI changes
   - **Testing**: Describe how you tested

6. Request review from maintainers

### PR Review Process

- At least one maintainer must approve
- All CI checks must pass
- No merge conflicts
- Code follows project standards
- Tests are included and passing
- Documentation is updated

## 🧪 Testing

### Backend Testing

```bash
cd server

# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Writing Tests

- Write unit tests for all services
- Write e2e tests for API endpoints
- Aim for >80% code coverage
- Test edge cases and error scenarios
- Mock external dependencies

Example unit test:
```typescript
describe('UsersService', () => {
  it('should create a user', async () => {
    const createUserDto = { email: 'test@example.com', password: 'password' };
    const result = await service.create(createUserDto);
    expect(result).toBeDefined();
    expect(result.email).toBe(createUserDto.email);
  });
});
```

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic
- Update README files when needed
- Keep API documentation up to date

### API Documentation

- Use Swagger decorators in NestJS
- Document all endpoints
- Include request/response examples
- Document error responses

## 🐛 Reporting Bugs

### Before Reporting

1. Check if the bug has already been reported
2. Verify it's reproducible
3. Collect relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear description of the bug.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Ubuntu 22.04]
- Node version: [e.g., 20.0.0]
- Browser: [e.g., Chrome 120]

**Additional context**
Any other relevant information.
```

## 💡 Feature Requests

We welcome feature requests! Please:

1. Check if it's already been requested
2. Provide a clear use case
3. Explain the expected behavior
4. Consider implementation details

## ❓ Questions

If you have questions:

- Check the documentation
- Search existing issues
- Open a new discussion on GitHub

## 🙏 Thank You

Thank you for contributing to the Educational Management System! Your efforts help make this project better for everyone.

---

**Happy Coding! 🚀**
