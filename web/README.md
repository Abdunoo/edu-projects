# 🎨 Educational Management System - Frontend

Modern, responsive frontend application built with Nuxt.js 4, featuring real-time updates, beautiful UI components, and comprehensive educational management features.

## ✨ Features

- 🎨 **Modern UI** - Built with Nuxt UI and Tailwind CSS
- 📱 **Responsive Design** - Mobile-first, works on all devices
- 🔄 **Real-time Dashboard** - Live statistics with WebSocket integration
- 📊 **Data Visualization** - Interactive charts with Chart.js
- 🔐 **Authentication** - Secure JWT-based authentication
- 🛡️ **Protected Routes** - Middleware-based route protection
- 🎯 **State Management** - Centralized state with Pinia
- 🚀 **Performance** - Optimized with Nuxt 4 and SSR
- 🎨 **Icons** - Beautiful Lucide icons via Iconify
- ✅ **Form Validation** - Zod schema validation

## 🏗️ Project Structure

```
web/
├── app/
│   ├── pages/              # Application pages
│   │   ├── index.vue      # Dashboard with real-time stats
│   │   ├── login.vue      # Authentication page
│   │   ├── users/         # User management pages
│   │   ├── students/      # Student management pages
│   │   ├── classes/       # Class management pages
│   │   ├── enrollments/   # Enrollment management pages
│   │   └── grades/        # Grade management pages
│   ├── components/        # Reusable Vue components
│   ├── composables/       # Vue composables & utilities
│   ├── stores/            # Pinia state stores
│   ├── middleware/        # Route middleware
│   ├── layouts/           # Page layouts
│   └── plugins/           # Nuxt plugins
├── public/                # Static assets
├── schemas/               # Zod validation schemas
└── types/                 # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 20.0.0
- npm, yarn, or pnpm
- Backend API running (see [../server/README.md](../server/README.md))

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` and update the API URLs:

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
NUXT_API_BASE=http://localhost:3001/api
```

### Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The application will automatically:
- Hot-reload on file changes
- Connect to the backend API
- Enable Vue DevTools

### Building for Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 📚 Key Pages

### Dashboard (`/`)
- Real-time statistics display
- WebSocket connection for live updates
- Overview cards for users, students, classes, and enrollments
- Recent activities feed
- Interactive charts

### User Management (`/users`)
- List all users with pagination
- Create new users with role assignment
- Edit user details and permissions
- Delete users (with confirmation)

### Student Management (`/students`)
- Comprehensive student directory
- Student profile management
- Enrollment tracking
- Grade overview

### Class Management (`/classes`)
- Course catalog
- Class scheduling
- Teacher assignment
- Student enrollment lists

### Enrollment Management (`/enrollments`)
- Student-class enrollment tracking
- Enrollment status management
- Bulk enrollment operations

### Grade Management (`/grades`)
- Grade entry and editing
- Student performance tracking
- Grade reports and analytics

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Login** - User credentials are sent to `/api/auth/login`
2. **Token Storage** - Access token stored in memory, refresh token in HTTP-only cookie
3. **Protected Routes** - Middleware checks authentication on protected pages
4. **Auto Refresh** - Tokens automatically refresh before expiration
5. **Logout** - Clears tokens and redirects to login

### Default Credentials

After seeding the backend database:

- **Admin**: `admin@example.com` / `admin123`
- **Teacher**: `teacher@example.com` / `teacher123`
- **Student**: `student@example.com` / `student123`

## 🎨 UI Components

Built with [Nuxt UI](https://ui.nuxt.com), featuring:

- **Forms** - Input, Select, Textarea, Checkbox, Radio
- **Data Display** - Table, Card, Badge, Avatar
- **Feedback** - Toast notifications, Modals, Alerts
- **Navigation** - Sidebar, Breadcrumbs, Tabs
- **Buttons** - Primary, Secondary, Danger variants

## 🔄 Real-time Features

WebSocket integration for live updates:

```typescript
// Composable: useWebSocket
const { isConnected, stats } = useWebSocket();
```

Features:
- Live dashboard statistics
- Real-time notifications
- Automatic reconnection
- Connection status indicator

## 📊 State Management

Pinia stores for centralized state:

```typescript
// Example: Auth Store
const authStore = useAuthStore();
await authStore.login(email, password);
const user = authStore.currentUser;
```

Available stores:
- **Auth Store** - User authentication state
- **User Store** - User management
- **Student Store** - Student data
- **Class Store** - Class information

## 🧪 Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format
```

## 🛠️ Tech Stack

- **Framework**: Nuxt.js 4
- **Language**: TypeScript 5
- **UI Library**: Nuxt UI 3
- **Styling**: Tailwind CSS 3
- **State Management**: Pinia 3
- **Charts**: Chart.js 4 + vue-chartjs
- **Icons**: Iconify (Lucide icons)
- **WebSocket**: Socket.io-client
- **Validation**: Zod 4
- **HTTP Client**: Nuxt's built-in $fetch

## 📖 Learn More

- [Nuxt Documentation](https://nuxt.com/docs)
- [Nuxt UI Documentation](https://ui.nuxt.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Chart.js Documentation](https://www.chartjs.org/docs)

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
.output/public
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

Check out the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more options.

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

## 📝 License

This project is part of the Educational Management System. See [LICENSE](../LICENSE) for details.

---

Made with ❤️ using Nuxt.js
