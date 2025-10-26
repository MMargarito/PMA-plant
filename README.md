# Myceili - Project Management Platform

> *Connected project management that grows with your team*

A modern, scalable project management platform built with microservices architecture, featuring real-time collaboration, comprehensive task management, and advanced security measures. Like a mycelium network, Myceili connects your team, projects, and tasks in a living, growing ecosystem.

## 🚀 Features

### Core Functionality
- **User Management**: Secure authentication with JWT, role-based access control
- **Project Management**: Create, update, and organize projects with progress tracking
- **Task Management**: Comprehensive task system with assignments, priorities, and due dates
- **Real-Time Notifications**: WebSocket-powered instant notifications for team collaboration
- **Team Collaboration**: Project members, roles, and permissions management
- **Activity Tracking**: Complete audit trail of all project and task activities

### Technical Highlights
- **Microservices Architecture**: Independently scalable services
- **GraphQL API Gateway**: Unified API endpoint with efficient data fetching
- **Real-Time Communication**: WebSocket support for live updates
- **Modern UI**: Beautiful, responsive React frontend with Tailwind CSS
- **State Management**: Redux Toolkit for predictable state management
- **Database per Service**: PostgreSQL databases for data isolation
- **Comprehensive Security**: OAuth 2.0, JWT, encryption, input validation

## 🏗️ Architecture

### Microservices

```
┌─────────────┐
│   Client    │ (React + Redux + WebSocket)
└──────┬──────┘
       │
┌──────▼──────┐
│ API Gateway │ (GraphQL + Auth)
└──────┬──────┘
       │
   ┌───┴────┬────────┬────────────┐
   │        │        │            │
┌──▼──┐ ┌──▼──┐ ┌───▼──┐ ┌───────▼────┐
│User │ │Proj │ │Task  │ │Notification│
│Svc  │ │Svc  │ │Svc   │ │Service     │
└──┬──┘ └──┬──┘ └───┬──┘ └─────┬──────┘
   │       │        │          │
┌──▼──┐ ┌──▼──┐ ┌───▼──┐ ┌────▼──┐
│ DB  │ │ DB  │ │ DB   │ │ Redis │
└─────┘ └─────┘ └──────┘ └───────┘
```

### Services

1. **API Gateway (Port 4000)**
   - GraphQL endpoint unification
   - Authentication and authorization
   - Request routing
   - Rate limiting

2. **User Service (Port 4001)**
   - User registration and authentication
   - Profile management
   - Role-based access control
   - Session management

3. **Project Service (Port 4002)**
   - Project CRUD operations
   - Project member management
   - Access control

4. **Task Service (Port 4003)**
   - Task management
   - Comments and attachments
   - Task dependencies
   - Statistics and reporting

5. **Notification Service (Port 4004)**
   - Real-time notifications via WebSocket
   - Email notifications
   - Notification preferences
   - Event broadcasting

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Cache**: Redis
- **WebSocket**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Logging**: Winston
- **Security**: Helmet.js, CORS

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **API Client**: Apollo Client (GraphQL)
- **WebSocket**: Socket.io-client
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **XSS Protection**: DOMPurify

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx (production)
- **CI/CD**: GitHub Actions (optional)

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Docker**: v20.x or higher
- **Docker Compose**: v2.x or higher
- **PostgreSQL**: v15.x (if running without Docker)
- **Redis**: v7.x (if running without Docker)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd project-management-app
```

### 2. Environment Setup

Create `.env` files for each service (see `.env.example` files in each service directory):

#### User Service (services/user-service/.env)
```bash
NODE_ENV=development
PORT=4001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=users_db
DB_USER=postgres
DB_PASSWORD=postgres123
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

#### API Gateway (services/api-gateway/.env)
```bash
NODE_ENV=development
PORT=4000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
USER_SERVICE_URL=http://localhost:4001
PROJECT_SERVICE_URL=http://localhost:4002
TASK_SERVICE_URL=http://localhost:4003
NOTIFICATION_SERVICE_URL=http://localhost:4004
```

#### Frontend (frontend/.env)
```bash
REACT_APP_GRAPHQL_URL=http://localhost:4000/graphql
REACT_APP_WS_URL=http://localhost:4004
```

### 3. Using Docker (Recommended)

#### Start all services
```bash
docker-compose up -d
```

#### View logs
```bash
docker-compose logs -f
```

#### Stop all services
```bash
docker-compose down
```

### 4. Manual Setup (Without Docker)

#### Install Dependencies
```bash
# Root
npm install

# Install all service dependencies
npm run install:all
```

#### Start Databases
```bash
# PostgreSQL (create 4 databases)
createdb users_db
createdb projects_db
createdb tasks_db
createdb notifications_db

# Start Redis
redis-server
```

#### Start Services
```bash
# Terminal 1 - API Gateway
cd services/api-gateway
npm run dev

# Terminal 2 - User Service
cd services/user-service
npm run dev

# Terminal 3 - Project Service
cd services/project-service
npm run dev

# Terminal 4 - Task Service
cd services/task-service
npm run dev

# Terminal 5 - Notification Service
cd services/notification-service
npm run dev

# Terminal 6 - Frontend
cd frontend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:4000/graphql
- **User Service Health**: http://localhost:4001/health
- **Project Service Health**: http://localhost:4002/health
- **Task Service Health**: http://localhost:4003/health
- **Notification Service Health**: http://localhost:4004/health

## 📖 Usage Guide

### Creating an Account

1. Navigate to http://localhost:3000
2. Click "Sign up" 
3. Fill in your details (first name, last name, email, password)
4. Click "Sign up" to create your account

### Creating a Project

1. Log in to your account
2. Navigate to "Projects" in the sidebar
3. Click "New Project"
4. Enter project details:
   - Name
   - Description
   - Status (planning, active, etc.)
   - Priority
   - Color (for visual identification)
5. Click "Create Project"

### Managing Tasks

1. Navigate to "Tasks" in the sidebar
2. Filter tasks by project, status, priority, or assignee
3. Click on a task to view details
4. Add comments, attachments, or update task status
5. Track progress with real-time updates

### Real-Time Notifications

- Receive instant notifications for:
  - Task assignments
  - Comment mentions
  - Project updates
  - Task status changes
- View all notifications in the Notifications page
- Mark notifications as read individually or all at once

## 🔒 Security

This application implements comprehensive security measures:

- **Authentication**: JWT-based with access and refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: HTTPS/TLS for data in transit, AES-256 for data at rest
- **Input Validation**: Joi schemas for all inputs
- **SQL Injection Prevention**: Parameterized queries via Sequelize ORM
- **XSS Protection**: Output encoding and DOMPurify
- **CSRF Protection**: Token-based authentication
- **Rate Limiting**: Prevent brute force attacks
- **Security Headers**: Helmet.js configuration
- **Password Security**: bcrypt hashing with salt rounds

For detailed security information, see [SECURITY.md](SECURITY.md)

## 📊 Database Schema

### User Service
- `users`: User accounts and profiles
- `user_sessions`: Active sessions and refresh tokens

### Project Service
- `projects`: Project information
- `project_members`: Project team members and roles

### Task Service
- `tasks`: Task details and assignments
- `task_comments`: Task comments and discussions
- `task_attachments`: File attachments
- `task_dependencies`: Task relationships

### Notification Service
- `notifications`: User notifications
- `notification_preferences`: User notification settings

## 🧪 Testing

```bash
# Run tests for all services
npm test

# Run tests for specific service
cd services/user-service
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📈 Performance Optimization

- **Database Connection Pooling**: Efficient database connections
- **Redis Caching**: Session and frequently accessed data
- **GraphQL DataLoader**: Batch and cache database queries
- **Code Splitting**: Lazy loading of React components
- **Image Optimization**: Compressed images with lazy loading
- **CDN**: Static assets served via CDN (production)

## 🔧 Development

### Code Structure

```
project-management-app/
├── services/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── graphql/       # GraphQL schemas and resolvers
│   │   │   ├── services/      # Service clients
│   │   │   └── middleware/    # Auth middleware
│   │   └── package.json
│   ├── user-service/
│   │   ├── src/
│   │   │   ├── models/        # Database models
│   │   │   ├── controllers/   # Business logic
│   │   │   ├── routes/        # API routes
│   │   │   └── middleware/    # Auth, validation
│   │   └── package.json
│   ├── project-service/
│   ├── task-service/
│   └── notification-service/
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store
│   │   ├── config/           # Configuration
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
├── ARCHITECTURE.md
├── SECURITY.md
└── README.md
```

### Coding Standards

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Code Reviews**: All changes reviewed before merge

## 🚀 Deployment

### Production Checklist

- [ ] Update all environment variables with production values
- [ ] Change JWT_SECRET to strong random string
- [ ] Enable HTTPS/TLS on all services
- [ ] Configure production database credentials
- [ ] Set up database backups
- [ ] Configure CDN for static assets
- [ ] Enable monitoring and logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure rate limiting
- [ ] Review security headers
- [ ] Test disaster recovery procedures

### Docker Production Build

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment

```bash
# Apply Kubernetes configurations
kubectl apply -f k8s/

# Check deployments
kubectl get deployments
kubectl get services
```

## 📝 API Documentation

### GraphQL Playground

Access the GraphQL Playground at http://localhost:4000/graphql

### Sample Queries

#### Register User
```graphql
mutation Register {
  register(input: {
    email: "user@example.com"
    password: "password123"
    first_name: "John"
    last_name: "Doe"
  }) {
    user {
      id
      email
      first_name
      last_name
    }
    accessToken
    refreshToken
  }
}
```

#### Create Project
```graphql
mutation CreateProject {
  createProject(input: {
    name: "My Project"
    description: "Project description"
    status: planning
    priority: high
    color: "#3B82F6"
  }) {
    id
    name
    status
    progress
  }
}
```

#### Get Projects
```graphql
query GetProjects {
  projects {
    projects {
      id
      name
      description
      status
      progress
      created_at
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Architecture inspired by microservices best practices
- UI design following modern UX principles
- Security implementation based on OWASP guidelines

## 📞 Support

For support, email support@yourdomain.com or open an issue in the repository.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Microservices architecture
- ✅ User authentication and authorization
- ✅ Project and task management
- ✅ Real-time notifications
- ✅ Modern responsive UI

### Phase 2 (Planned)
- [ ] File storage service (S3-compatible)
- [ ] Advanced analytics and reporting
- [ ] Gantt charts and timeline views
- [ ] Calendar integration
- [ ] Mobile applications (React Native)

### Phase 3 (Future)
- [ ] AI-powered task suggestions
- [ ] Time tracking and billing
- [ ] Resource management
- [ ] API webhooks
- [ ] Third-party integrations (Slack, Jira, etc.)

## 📊 Performance Metrics

- **API Response Time**: < 200ms (p95)
- **WebSocket Latency**: < 50ms
- **Database Query Time**: < 50ms (p95)
- **Frontend Load Time**: < 2s
- **Uptime**: 99.9% SLA

---

**Built with ❤️ using modern technologies and best practices**

