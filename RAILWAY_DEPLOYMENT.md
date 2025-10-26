# Railway Deployment Guide for Myceili

## Overview

This is a **microservices application** that requires deploying 6 separate services on Railway:

1. **User Service** - Authentication & user management
2. **Project Service** - Project management
3. **Task Service** - Task management
4. **Notification Service** - Notifications & WebSocket
5. **API Gateway** - GraphQL gateway (main entry point)
6. **Frontend** - React application

Plus **5 backing services**:
- 4× PostgreSQL databases (one per backend service)
- 1× Redis (for notification service)

---

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository connected to Railway
- This project pushed to GitHub

---

## Deployment Steps

### Step 1: Create a New Railway Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `PMA-plant` repository
5. Name your project: **"Myceili PMA"**

### Step 2: Add PostgreSQL Databases

You need **4 separate PostgreSQL databases**:

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "Add PostgreSQL"**
3. Rename it to **"postgres-users"**
4. Repeat 3 more times for:
   - **postgres-projects**
   - **postgres-tasks**
   - **postgres-notifications**

### Step 3: Add Redis

1. Click **"+ New"**
2. Select **"Database" → "Add Redis"**
3. Keep the default name **"Redis"**

### Step 4: Deploy Backend Services

Deploy each service **in this order**:

#### A. Deploy User Service

1. Click **"+ New" → "GitHub Repo"**
2. Select your repository
3. **Important:** Set **Root Directory** to: `services/user-service`
4. Name the service: **"user-service"**
5. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4001
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-123456789
   JWT_EXPIRES_IN=7d
   JWT_REFRESH_EXPIRES_IN=30d
   ```
6. **Connect to postgres-users database:**
   - Railway will auto-add `DATABASE_URL`
   - Add these variables (copy from postgres-users service):
     ```
     DB_HOST=${{postgres-users.PGHOST}}
     DB_PORT=${{postgres-users.PGPORT}}
     DB_NAME=${{postgres-users.PGDATABASE}}
     DB_USER=${{postgres-users.PGUSER}}
     DB_PASSWORD=${{postgres-users.PGPASSWORD}}
     ```
7. Click **"Deploy"**

#### B. Deploy Project Service

1. Click **"+ New" → "GitHub Repo"**
2. Set **Root Directory** to: `services/project-service`
3. Name: **"project-service"**
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4002
   DB_HOST=${{postgres-projects.PGHOST}}
   DB_PORT=${{postgres-projects.PGPORT}}
   DB_NAME=${{postgres-projects.PGDATABASE}}
   DB_USER=${{postgres-projects.PGUSER}}
   DB_PASSWORD=${{postgres-projects.PGPASSWORD}}
   ```
5. Deploy

#### C. Deploy Task Service

1. Click **"+ New" → "GitHub Repo"**
2. Set **Root Directory** to: `services/task-service`
3. Name: **"task-service"**
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4003
   DB_HOST=${{postgres-tasks.PGHOST}}
   DB_PORT=${{postgres-tasks.PGPORT}}
   DB_NAME=${{postgres-tasks.PGDATABASE}}
   DB_USER=${{postgres-tasks.PGUSER}}
   DB_PASSWORD=${{postgres-tasks.PGPASSWORD}}
   ```
5. Deploy

#### D. Deploy Notification Service

1. Click **"+ New" → "GitHub Repo"**
2. Set **Root Directory** to: `services/notification-service`
3. Name: **"notification-service"**
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4004
   DB_HOST=${{postgres-notifications.PGHOST}}
   DB_PORT=${{postgres-notifications.PGPORT}}
   DB_NAME=${{postgres-notifications.PGDATABASE}}
   DB_USER=${{postgres-notifications.PGUSER}}
   DB_PASSWORD=${{postgres-notifications.PGPASSWORD}}
   REDIS_HOST=${{Redis.REDIS_HOST}}
   REDIS_PORT=${{Redis.REDIS_PORT}}
   REDIS_PASSWORD=${{Redis.REDIS_PASSWORD}}
   ```
5. Deploy

#### E. Deploy API Gateway

**⚠️ Deploy this AFTER all other services are running!**

1. Click **"+ New" → "GitHub Repo"**
2. Set **Root Directory** to: `services/api-gateway`
3. Name: **"api-gateway"**
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=4000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production-123456789
   USER_SERVICE_URL=${{user-service.RAILWAY_PUBLIC_DOMAIN}}
   PROJECT_SERVICE_URL=${{project-service.RAILWAY_PUBLIC_DOMAIN}}
   TASK_SERVICE_URL=${{task-service.RAILWAY_PUBLIC_DOMAIN}}
   NOTIFICATION_SERVICE_URL=${{notification-service.RAILWAY_PUBLIC_DOMAIN}}
   ```
5. **Generate a Public Domain** for this service:
   - Go to Settings → Networking
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://api-gateway-production.up.railway.app`)
6. Deploy

### Step 5: Deploy Frontend

1. Click **"+ New" → "GitHub Repo"**
2. Set **Root Directory** to: `frontend`
3. Name: **"frontend"**
4. Add **Environment Variables**:
   ```
   NODE_ENV=production
   REACT_APP_GRAPHQL_URL=${{api-gateway.RAILWAY_PUBLIC_DOMAIN}}/graphql
   REACT_APP_WS_URL=${{notification-service.RAILWAY_PUBLIC_DOMAIN}}
   ```
5. **Generate a Public Domain**:
   - Go to Settings → Networking
   - Click **"Generate Domain"**
   - **This is your app URL!**
6. Deploy

---

## Step 6: Configure Service URLs

After all services have their domains, update the **API Gateway** environment variables with the full URLs:

```bash
USER_SERVICE_URL=https://user-service-production.up.railway.app
PROJECT_SERVICE_URL=https://project-service-production.up.railway.app
TASK_SERVICE_URL=https://task-service-production.up.railway.app
NOTIFICATION_SERVICE_URL=https://notification-service-production.up.railway.app
```

Then redeploy the API Gateway.

---

## Step 7: Update Frontend URLs

Update the **Frontend** with the correct API Gateway URL:

```bash
REACT_APP_GRAPHQL_URL=https://api-gateway-production.up.railway.app/graphql
REACT_APP_WS_URL=https://notification-service-production.up.railway.app
```

Then redeploy the frontend.

---

## Troubleshooting

### Error: `node:internal/module/cjs/loader:1386`

This means Railway tried to deploy from the root directory instead of the service directory.

**Fix:**
1. Go to the service settings
2. Under **"Build"** section
3. Set **"Root Directory"** to the correct path (e.g., `services/api-gateway`)
4. Redeploy

### Service Won't Start

**Check logs:**
1. Click on the service
2. Go to **"Deployments"**
3. Click on the latest deployment
4. View logs for error messages

**Common issues:**
- Missing environment variables
- Wrong database connection strings
- Service dependencies not ready yet

### Database Connection Errors

**Verify database variables:**
```bash
echo $DB_HOST
echo $DB_PORT
echo $DB_NAME
```

If empty, reconnect the database:
1. Go to service settings
2. Click **"Connect"** under the database
3. This will auto-populate the variables

### Services Can't Talk to Each Other

Make sure:
1. All services have **public domains generated**
2. API Gateway has correct URLs for all services
3. Services use `https://` (not `http://`)

---

## Environment Variables Checklist

### User Service ✅
- [ ] `NODE_ENV=production`
- [ ] `PORT=4001`
- [ ] `JWT_SECRET`
- [ ] `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### Project Service ✅
- [ ] `NODE_ENV=production`
- [ ] `PORT=4002`
- [ ] Database variables

### Task Service ✅
- [ ] `NODE_ENV=production`
- [ ] `PORT=4003`
- [ ] Database variables

### Notification Service ✅
- [ ] `NODE_ENV=production`
- [ ] `PORT=4004`
- [ ] Database variables
- [ ] Redis variables

### API Gateway ✅
- [ ] `NODE_ENV=production`
- [ ] `PORT=4000`
- [ ] `JWT_SECRET`
- [ ] All service URLs

### Frontend ✅
- [ ] `REACT_APP_GRAPHQL_URL`
- [ ] `REACT_APP_WS_URL`

---

## Cost Optimization Tips

Railway charges based on usage. Here are ways to reduce costs:

1. **Use the Free Tier**: $5 of free credits per month
2. **Shared Databases**: Consider using one PostgreSQL with multiple schemas (requires code changes)
3. **Scale Down**: Set minimum instances to 0 for non-critical services
4. **Monitoring**: Watch your usage dashboard

---

## Production Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set up custom domains (optional)
- [ ] Configure CORS properly in each service
- [ ] Set up health check endpoints
- [ ] Configure proper logging
- [ ] Set up monitoring/alerts
- [ ] Test all API endpoints
- [ ] Test frontend login/logout
- [ ] Test WebSocket connections
- [ ] Review Railway usage limits
- [ ] Back up databases regularly

---

## Architecture Diagram

```
┌─────────────┐
│   Frontend  │ ← User access this
│ (React App) │
└──────┬──────┘
       │ GraphQL
       ↓
┌─────────────┐
│ API Gateway │ ← Routes requests
│  (GraphQL)  │
└──────┬──────┘
       │
       ├─→ User Service      → postgres-users
       ├─→ Project Service   → postgres-projects  
       ├─→ Task Service      → postgres-tasks
       └─→ Notification Svc  → postgres-notifications + Redis
```

---

## Support

If you encounter issues:

1. Check Railway logs for each service
2. Verify environment variables
3. Test services individually
4. Check Railway status page
5. Contact Railway support

---

## Quick Deploy Commands

After initial setup, deploy updates:

```bash
# Commit changes
git add .
git commit -m "Update services"
git push

# Railway will auto-deploy!
```

---

**Your Myceili app should now be live on Railway! 🚀**

Access it at your frontend domain:
`https://[your-frontend].up.railway.app`

