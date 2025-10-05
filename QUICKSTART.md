# 🚀 Quick Start Guide

Get the Educational Management System up and running in minutes!

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js version (should be ≥ 20.0.0)
node --version

# Check npm version
npm --version

# Check PostgreSQL installation
psql --version
```

## 5-Minute Setup

### 1. Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/edu-projects.git
cd edu-projects

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../web
npm install
```

### 2. Database Setup (1 minute)

```bash
# Create PostgreSQL database
createdb edu_db

# Or using psql
psql -U postgres
CREATE DATABASE edu_db;
\q
```

### 3. Configure Environment (1 minute)

**Backend** (`server/.env`):
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/edu_db
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
```

**Frontend** (`web/.env`):
```bash
cd ../web
cp .env.example .env
```

The default values should work for local development.

### 4. Initialize Database (1 minute)

```bash
cd server

# Push schema to database
npm run db:push

# Seed with sample data (optional but recommended)
npm run db:seed
```

### 5. Start Development Servers (30 seconds)

**Terminal 1 - Backend**:
```bash
cd server
npm run start:dev
```

**Terminal 2 - Frontend**:
```bash
cd web
npm run dev
```

## 🎉 You're Ready!

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/docs

## Default Login Credentials

After seeding the database, use these credentials:

### Admin Account
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Permissions**: Full access to all features

### Teacher Account
- **Email**: `teacher@example.com`
- **Password**: `teacher123`
- **Permissions**: Manage students, classes, enrollments, grades

### Student Account
- **Email**: `student@example.com`
- **Password**: `student123`
- **Permissions**: View own information and grades

## Common Issues & Solutions

### Issue: Database connection failed

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if needed
sudo systemctl start postgresql

# Verify connection
psql -U postgres -d edu_db
```

### Issue: Port already in use

**Solution**:
```bash
# Backend (port 3001)
lsof -ti:3001 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

### Issue: Module not found

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database migration errors

**Solution**:
```bash
# Drop and recreate database
dropdb edu_db
createdb edu_db

# Push schema again
npm run db:push
npm run db:seed
```

## Next Steps

### Explore the Application

1. **Dashboard** - View real-time statistics
2. **Users** - Manage user accounts and roles
3. **Students** - Add and manage student information
4. **Classes** - Create courses and schedules
5. **Enrollments** - Enroll students in classes
6. **Grades** - Record and track student grades

### Development Workflow

1. **Make Changes** - Edit code in your favorite editor
2. **Hot Reload** - Changes reflect automatically
3. **Test** - Run tests with `npm run test`
4. **Commit** - Follow commit guidelines in CONTRIBUTING.md

### Learn More

- [Full Documentation](./README.md)
- [API Documentation](http://localhost:3001/docs)
- [Backend Guide](./server/README.md)
- [Frontend Guide](./web/README.md)
- [Contributing Guide](./CONTRIBUTING.md)

## Useful Commands

### Backend

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start with debugger

# Database
npm run db:generate      # Generate migrations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database

# Testing
npm run test             # Run unit tests
npm run test:e2e         # Run e2e tests
npm run test:cov         # Generate coverage

# Code Quality
npm run lint             # Check linting
npm run format           # Format code
```

### Frontend

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm run format           # Format code
```

## Production Deployment

See [README.md](./README.md) for detailed production deployment instructions.

Quick production build:

```bash
# Backend
cd server
npm run build
npm run start:prod

# Frontend
cd web
npm run build
npm run preview
```

## Getting Help

- **Documentation**: Check [README.md](./README.md) and [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Issues**: Search or create issues on GitHub
- **API Docs**: Visit http://localhost:3001/docs when server is running

## Tips for Success

1. **Use the API Documentation** - Interactive Swagger UI at `/docs`
2. **Check Logs** - Backend logs are in `server/logs/`
3. **Database Studio** - Use `npm run db:studio` to inspect database
4. **Hot Reload** - Both servers support hot-reload for fast development
5. **TypeScript** - Leverage TypeScript for better development experience

---

**Happy Coding! 🎓**

Need help? Check the [full documentation](./README.md) or open an issue on GitHub.
