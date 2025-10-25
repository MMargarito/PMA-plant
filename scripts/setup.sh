#!/bin/bash

# Project Management Application Setup Script
# This script helps you set up the development environment

echo "🚀 Project Management Application Setup"
echo "========================================"
echo ""

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm
echo "Checking npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm version: $NPM_VERSION"

# Check Docker
echo "Checking Docker..."
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is recommended but optional."
    echo "   You can install dependencies manually if Docker is not available."
else
    DOCKER_VERSION=$(docker -v)
    echo "✅ Docker version: $DOCKER_VERSION"
fi

# Check Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose -v)
    echo "✅ Docker Compose version: $COMPOSE_VERSION"
fi

echo ""
echo "Installing dependencies..."
echo "=========================="

# Root dependencies
echo "Installing root dependencies..."
npm install

# API Gateway
echo "Installing API Gateway dependencies..."
cd services/api-gateway && npm install && cd ../..

# User Service
echo "Installing User Service dependencies..."
cd services/user-service && npm install && cd ../..

# Project Service
echo "Installing Project Service dependencies..."
cd services/project-service && npm install && cd ../..

# Task Service
echo "Installing Task Service dependencies..."
cd services/task-service && npm install && cd ../..

# Notification Service
echo "Installing Notification Service dependencies..."
cd services/notification-service && npm install && cd ../..

# Frontend
echo "Installing Frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✅ All dependencies installed successfully!"
echo ""

# Create .env files
echo "Creating environment files..."
echo "=============================="

# Function to create .env file
create_env_file() {
    local service=$1
    local env_file="$service/.env"
    local example_file="$service/.env.example"
    
    if [ ! -f "$env_file" ]; then
        if [ -f "$example_file" ]; then
            echo "Creating $env_file from example..."
            cp "$example_file" "$env_file"
        else
            echo "⚠️  No .env.example found for $service"
        fi
    else
        echo "✅ $env_file already exists"
    fi
}

create_env_file "services/user-service"
create_env_file "services/project-service"
create_env_file "services/task-service"
create_env_file "services/notification-service"
create_env_file "services/api-gateway"
create_env_file "frontend"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "Next steps:"
echo "==========="
echo ""
echo "1. Start with Docker (recommended):"
echo "   $ docker-compose up -d"
echo ""
echo "2. Or start services manually:"
echo "   $ npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   API Gateway: http://localhost:4000/graphql"
echo ""
echo "For more information, see README.md"
echo ""

