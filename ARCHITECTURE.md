# Project Management Application - Microservices Architecture

## Overview
This is a modern Project Management Application built with a microservices architecture, designed for scalability, maintainability, and real-time collaboration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    (React + Redux + WebSocket)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS/WSS
                                │
┌───────────────────────────────▼─────────────────────────────────┐
│                         API Gateway                             │
│              (GraphQL + OAuth 2.0 + JWT + Routing)              │
└─────┬─────────────┬─────────────┬─────────────┬─────────────────┘
      │             │             │             │
      │             │             │             │
┌─────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐ ┌▼───────────────┐
│   User     │ │  Project   │ │   Task     │ │ Notification   │
│  Service   │ │  Service   │ │  Service   │ │   Service      │
│            │ │            │ │            │ │  (WebSocket)   │
│  Node.js   │ │  Node.js   │ │  Node.js   │ │   Node.js      │
└─────┬──────┘ └───┬────────┘ └─┬──────────┘ └┬───────────────┘
      │            │             │             │
      │            │             │             │
┌─────▼──────┐ ┌───▼────────┐ ┌─▼──────────┐ ┌▼───────────────┐
│ PostgreSQL │ │ PostgreSQL │ │ PostgreSQL │ │   Redis        │
│   (Users)  │ │ (Projects) │ │  (Tasks)   │ │   (Cache)      │
└────────────┘ └────────────┘ └────────────┘ └────────────────┘
```

## Microservices Description

### 1. API Gateway (Port: 4000)
**Purpose**: Single entry point for all client requests
**Responsibilities**:
- GraphQL API endpoint unification
- Request routing to appropriate microservices
- JWT-based authentication and authorization
- Rate limiting and request validation
- CORS management
- WebSocket connection management

**Technology Stack**:
- Apollo Server (GraphQL)
- Express.js
- JWT for authentication
- Helmet.js for security headers

### 2. User Service (Port: 4001)
**Purpose**: Manage user accounts, authentication, and profiles
**Responsibilities**:
- User registration and login
- Password hashing (bcrypt)
- Profile management
- Role-based access control (RBAC)
- Session management
- OAuth 2.0 integration

**Database Schema**:
- users (id, email, password_hash, first_name, last_name, role, created_at, updated_at)
- user_sessions (id, user_id, token, expires_at)
- user_roles (id, user_id, role_name, permissions)

**Technology Stack**:
- Node.js + Express
- PostgreSQL
- bcrypt for password hashing
- Sequelize ORM

### 3. Project Service (Port: 4002)
**Purpose**: Handle project creation, updates, and team management
**Responsibilities**:
- CRUD operations for projects
- Project member management
- Project status tracking
- Project analytics and reporting
- Project permissions

**Database Schema**:
- projects (id, name, description, owner_id, status, start_date, end_date, created_at, updated_at)
- project_members (id, project_id, user_id, role, joined_at)
- project_settings (id, project_id, settings_json)

**Technology Stack**:
- Node.js + Express
- PostgreSQL
- Sequelize ORM

### 4. Task Service (Port: 4003)
**Purpose**: Manage tasks, subtasks, and task dependencies
**Responsibilities**:
- Task CRUD operations
- Task assignment and tracking
- Task status updates
- Task prioritization
- Comments and attachments
- Task dependencies and relationships

**Database Schema**:
- tasks (id, project_id, title, description, status, priority, assigned_to, created_by, due_date, created_at, updated_at)
- task_comments (id, task_id, user_id, comment, created_at)
- task_attachments (id, task_id, filename, url, uploaded_by, uploaded_at)
- task_dependencies (id, task_id, depends_on_task_id)

**Technology Stack**:
- Node.js + Express
- PostgreSQL
- Sequelize ORM

### 5. Notification Service (Port: 4004)
**Purpose**: Handle real-time notifications and WebSocket connections
**Responsibilities**:
- Real-time push notifications
- WebSocket connection management
- Email notifications
- In-app notification center
- Notification preferences
- Event broadcasting

**Database Schema**:
- notifications (id, user_id, type, title, message, read, created_at)
- notification_preferences (id, user_id, email_enabled, push_enabled, notification_types)

**Technology Stack**:
- Node.js + Socket.io
- PostgreSQL
- Redis (for pub/sub and caching)
- Bull (job queue for email sending)

## Security Architecture

### Authentication Flow
1. User submits credentials to API Gateway
2. API Gateway forwards to User Service
3. User Service validates credentials
4. User Service generates JWT token
5. JWT token returned to client
6. Client includes JWT in Authorization header for subsequent requests
7. API Gateway validates JWT before routing requests

### Encryption Strategy
- **In Transit**: All communications use HTTPS/TLS 1.3
- **At Rest**: PostgreSQL encryption at rest using AES-256
- **Passwords**: bcrypt with salt rounds (12)
- **Tokens**: JWT with RS256 algorithm (asymmetric keys)

### Input Validation
- API Gateway: Schema validation using GraphQL type system
- Services: Joi validation library for all inputs
- Database: Parameterized queries via Sequelize ORM (prevents SQL injection)
- Frontend: React's built-in XSS protection + DOMPurify for user-generated content

### Security Headers
- Helmet.js for setting security headers
- CORS configuration
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)

## Frontend Architecture

### React Application Structure
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── store/            # Redux store, actions, reducers
│   ├── services/         # API and WebSocket services
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── styles/           # Global styles
│   └── App.tsx           # Root component
```

### State Management (Redux)
- **Authentication State**: User info, tokens, authentication status
- **Projects State**: List of projects, current project
- **Tasks State**: Tasks list, filters, current task
- **Notifications State**: Notification list, unread count
- **UI State**: Loading states, modals, sidebar visibility

### Real-time Updates
- WebSocket connection to Notification Service
- Redux middleware for handling WebSocket events
- Optimistic updates for better UX
- Automatic reconnection on disconnect

## Database Design Principles

### ACID Compliance
- PostgreSQL ensures ACID transactions
- Foreign key constraints for referential integrity
- Indexes on frequently queried columns
- Proper transaction management in service layer

### Scalability
- Each service has its own database (database per service pattern)
- Connection pooling for efficient resource usage
- Read replicas for scaling read operations
- Database sharding strategy for future growth

## API Design

### GraphQL Schema
- Type-safe API with strong typing
- Efficient data fetching (no over-fetching/under-fetching)
- Real-time subscriptions for live updates
- Batch queries for optimal performance

### REST Endpoints (Internal Service Communication)
- Services communicate via REST APIs internally
- Standardized error responses
- Versioned APIs (v1, v2, etc.)
- Health check endpoints

## Deployment Strategy

### Docker Containers
- Each service runs in its own container
- Docker Compose for local development
- Kubernetes-ready for production deployment

### Environment Configuration
- Environment-specific configurations
- Secrets management
- Feature flags

## Monitoring & Logging

### Application Monitoring
- Winston for structured logging
- Morgan for HTTP request logging
- Performance metrics tracking
- Error tracking and alerting

### Health Checks
- Each service exposes /health endpoint
- Database connection checks
- Dependency health verification

## Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start databases: `docker-compose up -d postgres redis`
5. Run services: `npm run dev`
6. Start frontend: `cd frontend && npm start`

### Testing Strategy
- Unit tests (Jest)
- Integration tests (Supertest)
- E2E tests (Cypress)
- API tests (Postman/Newman)

## Performance Optimization

### Caching Strategy
- Redis for session caching
- API response caching
- Database query result caching
- Client-side caching with React Query

### Load Balancing
- Nginx as reverse proxy
- Service instance scaling
- Database read replicas
- CDN for static assets

## Future Enhancements
- Service mesh (Istio/Linkerd)
- Event sourcing and CQRS
- Elasticsearch for advanced search
- Analytics service
- File storage service (S3-compatible)
- Chat/collaboration service

