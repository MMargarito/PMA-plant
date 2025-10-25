# Quick Start Guide

## Fixed Docker Build Issues ✅

The Docker build errors have been resolved. The issue was that `npm ci` requires a `package-lock.json` file. I've updated all Dockerfiles to use `npm install --omit=dev` instead.

## Starting the Application

### Option 1: Using Docker (Recommended)

```bash
# 1. Build and start all services
docker-compose up --build -d

# 2. Check service status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Access the application
# Frontend: http://localhost:3000
# API Gateway (GraphQL): http://localhost:4000/graphql
```

### Option 2: Manual Setup

If you prefer to run services manually:

```bash
# 1. Install dependencies for all services
cd services/api-gateway && npm install && cd ../..
cd services/user-service && npm install && cd ../..
cd services/project-service && npm install && cd ../..
cd services/task-service && npm install && cd ../..
cd services/notification-service && npm install && cd ../..
cd frontend && npm install && cd ..

# 2. Start databases with Docker
docker-compose up -d postgres-users postgres-projects postgres-tasks postgres-notifications redis

# 3. Start each service in separate terminals

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

## Verifying the Setup

### Check Service Health

Once all services are running, verify they're healthy:

```bash
# Health check endpoints
curl http://localhost:4001/health  # User Service
curl http://localhost:4002/health  # Project Service
curl http://localhost:4003/health  # Task Service
curl http://localhost:4004/health  # Notification Service
curl http://localhost:4000/health  # API Gateway
```

Expected response:
```json
{
  "status": "healthy",
  "service": "service-name",
  "timestamp": "2024-10-25T...",
  "database": "connected"
}
```

### Check Frontend

1. Open http://localhost:3000 in your browser
2. You should see the login page
3. Click "Sign up" to create an account

## Common Issues

### Issue: Port already in use

```bash
# Find process using the port
# Windows
netstat -ano | findstr :4000

# Linux/Mac
lsof -i :4000

# Kill the process or change the port in docker-compose.yml
```

### Issue: Database connection failed

```bash
# Restart database containers
docker-compose restart postgres-users postgres-projects postgres-tasks postgres-notifications

# Check database logs
docker-compose logs postgres-users
```

### Issue: Redis connection failed

```bash
# Restart Redis
docker-compose restart redis

# Check Redis logs
docker-compose logs redis
```

### Issue: Services can't connect to each other

```bash
# Ensure all services are on the same Docker network
docker network ls
docker network inspect pma_pma-network
```

## Testing the Application

### 1. Create an Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
4. Click "Sign up"

### 2. Create a Project

1. After login, go to "Projects" in the sidebar
2. Click "New Project"
3. Fill in:
   - Name: My First Project
   - Description: Testing the application
   - Color: Choose any color
4. Click "Create Project"

### 3. Test Real-Time Notifications

Real-time notifications work automatically. When you:
- Create a project
- Update a task
- Add a comment

You'll see notifications appear in real-time in the bell icon (top right).

## GraphQL Playground

Access the GraphQL Playground at http://localhost:4000/graphql

### Sample Query

```graphql
query GetProjects {
  projects {
    projects {
      id
      name
      description
      status
      progress
    }
  }
}
```

Note: You'll need to add the Authorization header:
```
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

You can get your access token from the browser console after logging in, or from the Network tab in DevTools.

## Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## Environment Variables

For production, update these environment variables:

1. **JWT_SECRET**: Generate a strong random string
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Database Passwords**: Use strong passwords
3. **CORS_ORIGIN**: Set to your frontend domain
4. **NODE_ENV**: Set to 'production'

## Next Steps

1. **Explore the Application**
   - Create multiple projects
   - Add tasks to projects
   - Invite team members (future feature)
   - Check notifications

2. **Review Documentation**
   - See `README.md` for full documentation
   - Check `ARCHITECTURE.md` for system design
   - Read `SECURITY.md` for security details

3. **Development**
   - See `CONTRIBUTING.md` for contribution guidelines
   - Add tests for new features
   - Extend functionality

## Useful Commands

```bash
# Rebuild a specific service
docker-compose build user-service

# Restart a specific service
docker-compose restart user-service

# View logs for a specific service
docker-compose logs -f user-service

# Execute commands in a running container
docker-compose exec user-service sh

# Remove all containers and volumes
docker-compose down -v

# Check Docker disk usage
docker system df

# Clean up Docker
docker system prune -a
```

## Production Deployment

For production deployment:

1. Use environment-specific `.env` files
2. Enable HTTPS/TLS on all endpoints
3. Use strong JWT secrets
4. Configure database backups
5. Set up monitoring and logging
6. Use a process manager (PM2) or container orchestration (Kubernetes)
7. Configure CDN for static assets
8. Enable rate limiting
9. Set up error tracking (e.g., Sentry)

See `README.md` for detailed production deployment instructions.

## Support

If you encounter issues:
1. Check the service logs: `docker-compose logs [service-name]`
2. Verify all environment variables are set correctly
3. Ensure all ports are available
4. Check Docker and Node.js versions
5. Review `README.md` for detailed troubleshooting

---

**Everything is now ready to run! 🚀**

Start with: `docker-compose up --build -d`

