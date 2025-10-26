# 🚀 Railway Quick Start - Myceili

## The Problem You Had

❌ **Error:** `node:internal/module/cjs/loader:1386`

**Cause:** Railway tried to deploy from the root directory, but this is a **microservices app** with 6 separate services that need individual deployments.

---

## The Solution

Deploy **each service separately** with its own root directory.

---

## Quick Deployment Order

Deploy in this order:

### 1️⃣ **Databases First** (5 services)
```
+ New → Database → PostgreSQL (name: postgres-users)
+ New → Database → PostgreSQL (name: postgres-projects)  
+ New → Database → PostgreSQL (name: postgres-tasks)
+ New → Database → PostgreSQL (name: postgres-notifications)
+ New → Database → Redis
```

### 2️⃣ **Backend Services** (4 services)

For each service, set the **Root Directory**:

| Service | Root Directory | Port |
|---------|---------------|------|
| user-service | `services/user-service` | 4001 |
| project-service | `services/project-service` | 4002 |
| task-service | `services/task-service` | 4003 |
| notification-service | `services/notification-service` | 4004 |

### 3️⃣ **API Gateway** (1 service)
```
Root Directory: services/api-gateway
Port: 4000
⚠️ Deploy AFTER backend services are running
✅ Generate Public Domain - this is your API endpoint
```

### 4️⃣ **Frontend** (1 service)
```
Root Directory: frontend
✅ Generate Public Domain - this is your app URL
```

---

## Critical Settings for Each Service

### All Services Need:
```bash
# In Railway service settings:
1. Click on service
2. Go to "Variables" tab
3. Add environment variables
4. Go to "Settings" → Set Root Directory
5. Deploy
```

### Root Directories (VERY IMPORTANT!)

If you see the loader error, you forgot to set the root directory!

```
❌ WRONG: No root directory (deploys from repo root)
✅ RIGHT: Set root directory to specific service folder
```

---

## Environment Variable Template

### User Service
```bash
NODE_ENV=production
PORT=4001
JWT_SECRET=your-super-secret-jwt-key
DB_HOST=${{postgres-users.PGHOST}}
DB_PORT=${{postgres-users.PGPORT}}
DB_NAME=${{postgres-users.PGDATABASE}}
DB_USER=${{postgres-users.PGUSER}}
DB_PASSWORD=${{postgres-users.PGPASSWORD}}
```

### API Gateway
```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
USER_SERVICE_URL=https://[user-service-domain]
PROJECT_SERVICE_URL=https://[project-service-domain]
TASK_SERVICE_URL=https://[task-service-domain]
NOTIFICATION_SERVICE_URL=https://[notification-service-domain]
```

### Frontend
```bash
REACT_APP_GRAPHQL_URL=https://[api-gateway-domain]/graphql
REACT_APP_WS_URL=https://[notification-service-domain]
```

---

## After First Deploy

1. ✅ Check all services are running (green status)
2. ✅ Generate public domains for API Gateway and Frontend
3. ✅ Update environment variables with real URLs
4. ✅ Redeploy API Gateway and Frontend
5. ✅ Test your app at the Frontend URL

---

## Common Errors & Fixes

### ❌ `node:internal/module/cjs/loader:1386`
**Fix:** Set **Root Directory** in service settings

### ❌ `Cannot find module`
**Fix:** Check `package.json` exists in root directory

### ❌ `ECONNREFUSED`
**Fix:** Services need public domains to talk to each other

### ❌ Database connection failed
**Fix:** Link database to service and check variables

---

## Your Final Railway Setup

```
Railway Project: "Myceili PMA"
├── postgres-users (database)
├── postgres-projects (database)
├── postgres-tasks (database)
├── postgres-notifications (database)
├── Redis (database)
├── user-service (app)
├── project-service (app)
├── task-service (app)
├── notification-service (app)
├── api-gateway (app) ← Generate domain
└── frontend (app) ← Generate domain (YOUR APP URL!)
```

**Total:** 11 Railway services

---

## Estimated Costs

- **Free Tier**: $5/month included
- **Databases**: ~$5-10/month (5 databases)
- **Apps**: ~$15-20/month (6 apps)
- **Total**: ~$20-30/month

💡 **Tip:** Start with hobby tier and scale as needed

---

## Need Help?

1. Read full guide: `RAILWAY_DEPLOYMENT.md`
2. Check Railway logs for each service
3. Verify environment variables are set
4. Make sure root directories are correct

---

**Good luck! Your Myceili app will be live in ~10 minutes! 🎉**

