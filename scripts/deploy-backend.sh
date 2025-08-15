#!/bin/bash

# 🔧 Backend-only Deployment Script  
# Deploy only the Nest.js backend API

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_REPO="https://github.com/rsdgcxym007/boxing-ticket-backend.git"
VPS_IP="43.229.133.51"
VPS_USER="deploy"
BACKEND_DIR="/var/www/patongboxing-api"
BACKEND_APP_NAME="patong-boxing-api"

echo -e "${BLUE}🔧 Backend API Deployment - Patong Boxing Stadium${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Deploy backend to VPS
echo -e "${YELLOW}🚀 Deploying backend to VPS...${NC}"

ssh $VPS_USER@$VPS_IP << EOF
    # Clone or update backend repository
    if [ -d "$BACKEND_DIR" ]; then
        echo "📥 Updating existing backend repository..."
        cd $BACKEND_DIR
        git pull origin main
    else
        echo "📥 Cloning backend repository..."
        git clone $BACKEND_REPO $BACKEND_DIR
        cd $BACKEND_DIR
    fi
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    npm install --production
    
    # Build backend
    echo "🏗️  Building backend..."
    npm run build
    
    # Create PM2 ecosystem config for backend
    cat > ecosystem.backend.config.cjs << 'BACKENDCONFIG'
module.exports = {
  apps: [
    {
      name: "patong-boxing-api",
      script: "dist/main.js",
      cwd: "$BACKEND_DIR",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 4000
      },
      env_production: {
        NODE_ENV: "production", 
        PORT: 4000,
        DATABASE_URL: "postgresql://username:password@localhost:5432/patongboxing",
        JWT_SECRET: "your-jwt-secret-key",
        CORS_ORIGIN: "https://patongboxingstadiumticket.com"
      }
    }
  ]
};
BACKENDCONFIG
    
    # Stop existing backend
    echo "🛑 Stopping existing backend..."
    pm2 stop $BACKEND_APP_NAME 2>/dev/null || true
    pm2 delete $BACKEND_APP_NAME 2>/dev/null || true
    
    # Start backend
    echo "🚀 Starting backend..."
    pm2 start ecosystem.backend.config.cjs --env production
    pm2 save
    
    echo "📊 Backend PM2 Status:"
    pm2 status $BACKEND_APP_NAME
EOF

# Step 2: Health check
echo -e "${YELLOW}🔍 Backend health check...${NC}"
sleep 10

if curl -f -s "https://api-patongboxingstadiumticket.com/health" > /dev/null; then
    echo -e "${GREEN}✅ Backend deployment successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not responding yet${NC}"
    echo -e "${BLUE}💡 Check backend logs: ssh $VPS_USER@$VPS_IP 'pm2 logs $BACKEND_APP_NAME'${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Backend deployment completed!${NC}"
echo -e "${BLUE}🔗 API Endpoint: https://api-patongboxingstadiumticket.com${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "${BLUE}1. Configure your database connection${NC}"
echo -e "${BLUE}2. Update JWT_SECRET in production environment${NC}"
echo -e "${BLUE}3. Test API endpoints${NC}"
