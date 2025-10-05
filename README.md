# 🎓 Educational Management System

A modern, full-stack educational management system built with NestJS and Nuxt.js, featuring real-time updates, role-based access control, and comprehensive student information management.

## 📋 Overview

This project is a complete educational management platform that allows institutions to manage students, classes, enrollments, grades, and users with fine-grained permission controls. The system features a real-time dashboard with WebSocket integration for live updates.

## ✨ Features

### Backend (NestJS)
- 🔐 **JWT Authentication** - Secure authentication with access and refresh tokens
- 🛡️ **Role-Based Access Control (RBAC)** - Fine-grained permission system
- 💾 **Drizzle ORM** - Type-safe database operations with PostgreSQL
- 🔄 **Real-time Updates** - WebSocket integration for live dashboard updates
- 📊 **RESTful API** - Comprehensive API with Swagger documentation
- 📝 **Structured Logging** - Winston-based logging system
- 🚦 **Rate Limiting** - Built-in API protection
- ✅ **Validation** - Request validation with class-validator and Zod
- 🧪 **Testing** - Jest configured for unit and e2e tests

### Frontend (Nuxt.js)
- 🎨 **Modern UI** - Built with Nuxt UI and Tailwind CSS
- 📱 **Responsive Design** - Mobile-friendly interface
- 🔄 **Real-time Dashboard** - Live statistics with WebSocket connection
- 📊 **Data Visualization** - Charts and graphs with Chart.js
- 🔐 **Protected Routes** - Authentication middleware
- 🎯 **State Management** - Pinia for centralized state
- 🚀 **Performance** - Optimized with Nuxt 4

### Core Modules
- 👥 **User Management** - Create, read, update, delete users with role assignment
- 🎓 **Student Management** - Comprehensive student information system
- 📚 **Class Management** - Course and class scheduling
- 📝 **Enrollment Management** - Student-class enrollment tracking
- 📊 **Grade Management** - Student grade recording and reporting
- 🔑 **Role & Permission Management** - Dynamic permission assignment

## 🏗️ Architecture

```
edu-projects/
├── server/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/          # Authentication & authorization
│   │   ├── modules/       # Feature modules
│   │   │   ├── users/     # User management
│   │   │   ├── students/  # Student management
│   │   │   ├── classes/   # Class management
│   │   │   ├── enrollments/ # Enrollment management
│   │   │   ├── grades/    # Grade management
│   │   │   ├── roles/     # Role management
│   │   │   └── dashboard/ # Real-time dashboard
│   │   ├── database/      # Database schema & migrations
│   │   └── common/        # Shared utilities
│   └── ...
└── web/                   # Nuxt.js Frontend
    ├── app/
    │   ├── pages/         # Application pages
    │   ├── components/    # Reusable components
    │   ├── composables/   # Vue composables
    │   ├── stores/        # Pinia stores
    │   └── middleware/    # Route middleware
    └── ...
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **npm** or **yarn**
- **PostgreSQL** ≥ 15.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/edu-projects.git
   cd edu-projects
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials and secrets
   
   # Run database migrations
   npm run db:push
   
   # (Optional) Seed database with sample data
   npm run db:seed
   ```

3. **Setup Frontend**
   ```bash
   cd ../web
   npm install
   
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Development

1. **Start the backend server**
   ```bash
   cd server
   npm run start:dev
   ```
   The API will be available at `http://localhost:3001`
   
   API Documentation: `http://localhost:3001/docs`

2. **Start the frontend development server**
   ```bash
   cd web
   npm run dev
   ```
   The web app will be available at `http://localhost:3000`

### Default Credentials

After seeding the database, you can login with:

- **Admin User**
  - Email: `admin@example.com`
  - Password: `admin123`

- **Teacher User**
  - Email: `teacher@example.com`
  - Password: `teacher123`

- **Student User**
  - Email: `student@example.com`
  - Password: `student123`

## 📚 API Documentation

Once the backend server is running, access the interactive API documentation at:

```
http://localhost:3001/docs
```

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing
- Authentication integration

## 🔧 Configuration

### Backend Environment Variables

See `server/.env.example` for all available configuration options:

- **Database**: PostgreSQL connection string
- **JWT**: Secret keys and token expiration
- **Server**: Port and environment settings
- **CORS**: Frontend URL configuration

### Frontend Environment Variables

See `web/.env.example` for configuration:

- **API_BASE**: Backend API URL
- **WS_URL**: WebSocket connection URL

## 🧪 Testing

### Backend Tests

```bash
cd server

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate coverage report
npm run test:cov
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 📦 Production Build

### Backend

```bash
cd server
npm run build
npm run start:prod
```

### Frontend

```bash
cd web
npm run build
npm run preview
```

## 🔐 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Refresh Tokens** - Long-lived refresh tokens stored in HTTP-only cookies
- **Password Hashing** - Bcrypt for secure password storage
- **CORS Protection** - Configured CORS policies
- **Rate Limiting** - API endpoint protection
- **Input Validation** - Comprehensive request validation
- **SQL Injection Prevention** - Parameterized queries with Drizzle ORM

## 🎯 Permission System

The system implements a comprehensive RBAC model with the following permissions:

- **User Permissions**: `user:create`, `user:read`, `user:update`, `user:delete`
- **Student Permissions**: `student:create`, `student:read`, `student:update`, `student:delete`
- **Class Permissions**: `class:create`, `class:read`, `class:update`, `class:delete`
- **Enrollment Permissions**: `enrollment:create`, `enrollment:read`, `enrollment:update`, `enrollment:delete`
- **Grade Permissions**: `grade:create`, `grade:read`, `grade:update`, `grade:delete`
- **Role Permissions**: `role:create`, `role:read`, `role:update`, `role:delete`

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript 5
- **Database**: PostgreSQL 15+
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js + JWT
- **Validation**: class-validator, Zod
- **Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Testing**: Jest

### Frontend
- **Framework**: Nuxt.js 4
- **Language**: TypeScript
- **UI Library**: Nuxt UI
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Charts**: Chart.js + vue-chartjs
- **Icons**: Iconify (Lucide icons)
- **WebSocket**: Socket.io-client

## 📖 Documentation

- [Backend README](./server/README.md) - Detailed backend documentation
- [Frontend README](./web/README.md) - Detailed frontend documentation
- [API Documentation](http://localhost:3001/docs) - Interactive API docs (when server is running)

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Abdun**

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- Nuxt team for the powerful Vue framework
- All contributors and open-source libraries used in this project

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review the API documentation at `/docs`

---

Made with ❤️ by Abdun
