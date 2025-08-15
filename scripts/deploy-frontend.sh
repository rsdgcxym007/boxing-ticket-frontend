#!/bin/bash

# 🎨 Frontend-only Deployment Script
# Deploy only the Nuxt.js frontend application

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
VPS_IP="43.229.133.51"
VPS_USER="deploy"
PROJECT_DIR="/var/www/patongboxing"
APP_NAME="patong-boxing-stadium"

echo -e "${BLUE}🎨 Frontend Deployment - Patong Boxing Stadium${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
npm install
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# Step 2: Deploy to VPS
echo -e "${YELLOW}🚀 Deploying to VPS...${NC}"

# Sync only frontend files
rsync -avz --delete \
    --include='.output/***' \
    --include='package.json' \
    --include='ecosystem.config.cjs' \
    --include='nuxt.config.ts' \
    --exclude='*' \
    ./ $VPS_USER@$VPS_IP:$PROJECT_DIR/

# Step 3: Restart frontend on VPS
ssh $VPS_USER@$VPS_IP << EOF
    cd $PROJECT_DIR
    
    echo "🔄 Restarting frontend..."
    pm2 restart $APP_NAME 2>/dev/null || {
        echo "🚀 Starting fresh frontend instance..."
        npm install --production
        pm2 start ecosystem.config.cjs
        pm2 save
    }
    
    echo "📊 PM2 Status:"
    pm2 status $APP_NAME
EOF

# Step 4: Quick health check
echo -e "${YELLOW}🔍 Health check...${NC}"
sleep 5

if curl -f -s "https://patongboxingstadiumticket.com" > /dev/null; then
    echo -e "${GREEN}✅ Frontend deployment successful!${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not responding yet, check logs with: npm run pm2:logs${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Frontend deployment completed!${NC}"
echo -e "${BLUE}🌐 Visit: https://patongboxingstadiumticket.com${NC}"
