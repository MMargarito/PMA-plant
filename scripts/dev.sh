#!/bin/bash

# Development script to start all services

echo "🚀 Starting all services in development mode..."
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $port is already in use"
        return 1
    fi
    return 0
}

# Check if databases are running
echo "Checking database connections..."

# Check PostgreSQL
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running on default port"
    echo "   Start PostgreSQL or use Docker: docker-compose up -d postgres-users postgres-projects postgres-tasks postgres-notifications"
fi

# Check Redis
if ! redis-cli ping >/dev/null 2>&1; then
    echo "⚠️  Redis is not running"
    echo "   Start Redis or use Docker: docker-compose up -d redis"
fi

echo ""
echo "Starting services..."
echo "===================="

# Start all services using concurrently (from root package.json)
npm run dev

