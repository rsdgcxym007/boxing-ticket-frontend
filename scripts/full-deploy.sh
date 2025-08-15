#!/bin/bash

# 🚀 Full Deployment Script for Patong Boxing Stadium
# This script deploys both frontend and backend with domain configuration

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
FRONTEND_DOMAIN="patongboxingstadiumticket.com"
BACKEND_DOMAIN="api-patongboxingstadiumticket.com"
VPS_IP="43.229.133.51"
VPS_USER="deploy"
PROJECT_DIR="/var/www/patongboxing"
FRONTEND_PORT=3000
BACKEND_PORT=4000

echo -e "${PURPLE}🥊 Patong Boxing Stadium - Full Deployment${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Step 1: Check prerequisites
echo -e "${YELLOW}📋 Step 1: Checking prerequisites...${NC}"
if ! command -v ssh &> /dev/null; then
    echo -e "${RED}❌ SSH not found${NC}"
    exit 1
fi

if ! command -v rsync &> /dev/null; then
    echo -e "${RED}❌ rsync not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Step 2: Build frontend
echo -e "${YELLOW}📦 Step 2: Building frontend...${NC}"
npm install
npm run build

echo -e "${GREEN}✅ Frontend built successfully${NC}"

# Step 3: Deploy to VPS
echo -e "${YELLOW}🚀 Step 3: Deploying to VPS...${NC}"

# Sync files to VPS
echo -e "${BLUE}📤 Syncing files to VPS...${NC}"
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.nuxt' \
    --exclude 'dist' \
    ./ $VPS_USER@$VPS_IP:$PROJECT_DIR/

# Step 4: Setup on VPS
echo -e "${YELLOW}⚙️  Step 4: Setting up on VPS...${NC}"

ssh $VPS_USER@$VPS_IP << EOF
    cd $PROJECT_DIR
    
    # Install dependencies
    echo "📦 Installing dependencies..."
    npm install --production
    
    # Build application
    echo "🏗️  Building application..."
    npm run build
    
    # Stop existing PM2 processes
    echo "🛑 Stopping existing processes..."
    pm2 stop patong-boxing-stadium 2>/dev/null || true
    pm2 delete patong-boxing-stadium 2>/dev/null || true
    
    # Start new PM2 process
    echo "🚀 Starting new processes..."
    pm2 start ecosystem.config.cjs
    pm2 save
    
    # Setup nginx if not exists
    if [ ! -f /etc/nginx/sites-available/patongboxing ]; then
        echo "🌐 Setting up Nginx configuration..."
        sudo tee /etc/nginx/sites-available/patongboxing > /dev/null << 'NGINXCONF'
# Frontend - patongboxingstadiumticket.com
server {
    listen 80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Backend API - api-patongboxingstadiumticket.com  
server {
    listen 80;
    server_name api-patongboxingstadiumticket.com;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINXCONF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/patongboxing /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
    fi
    
    # Setup SSL certificates with Certbot
    echo "🔒 Setting up SSL certificates..."
    sudo certbot --nginx -d patongboxingstadiumticket.com -d www.patongboxingstadiumticket.com -d api-patongboxingstadiumticket.com --non-interactive --agree-tos --email info@patongboxing.com || true
    
    echo "✅ Deployment completed!"
EOF

# Step 5: Health check
echo -e "${YELLOW}🔍 Step 5: Running health check...${NC}"
sleep 10

echo -e "${BLUE}Testing frontend...${NC}"
if curl -f -s "http://$FRONTEND_DOMAIN" > /dev/null; then
    echo -e "${GREEN}✅ Frontend OK${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend not responding yet${NC}"
fi

echo -e "${BLUE}Testing backend...${NC}"
if curl -f -s "http://$BACKEND_DOMAIN/health" > /dev/null; then
    echo -e "${GREEN}✅ Backend OK${NC}"
else
    echo -e "${YELLOW}⚠️  Backend not responding yet${NC}"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Full deployment completed!${NC}"
echo ""
echo -e "${CYAN}🌐 Your applications are now available at:${NC}"
echo -e "${BLUE}📱 Frontend: https://$FRONTEND_DOMAIN${NC}"
echo -e "${BLUE}🔗 Backend API: https://$BACKEND_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📊 Monitor with:${NC}"
echo -e "${BLUE}• pm2 status${NC}"
echo -e "${BLUE}• pm2 logs patong-boxing-stadium${NC}"
echo -e "${BLUE}• npm run health-check${NC}"
