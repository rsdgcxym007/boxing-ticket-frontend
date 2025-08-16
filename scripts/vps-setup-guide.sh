#!/bin/bash

# =============================================================================
# Patong Boxing Stadium - VPS Setup Script
# Complete deployment setup with SSH instructions
# =============================================================================

echo "🥊 PATONG BOXING STADIUM - VPS DEPLOYMENT SETUP"
echo "=============================================="
echo ""
echo "📋 This script will guide you through setting up:"
echo "   1. Clone project to VPS"
echo "   2. Setup GitHub webhook auto-deployment"
echo "   3. Configure PM2 with ecosystem"
echo "   4. Setup Discord notifications"
echo ""
echo "🌐 VPS IP: 43.229.133.51"
echo "👤 User: root"
echo "🌿 Branch: featues/v1"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
VPS_IP="43.229.133.51"
VPS_USER="root"
PROJECT_PATH="/var/www/patongboxing-frontend"
REPO_URL="https://github.com/rsdgcxym007/boxing-ticket-frontend.git"
BRANCH="featues/v1"
WEBHOOK_PORT="9000"

echo -e "${BLUE}📋 STEP-BY-STEP VPS SETUP INSTRUCTIONS${NC}"
echo "======================================"
echo ""

echo -e "${YELLOW}STEP 1: Connect to VPS${NC}"
echo "Run this command to connect to your VPS:"
echo ""
echo -e "${GREEN}ssh root@43.229.133.51${NC}"
echo ""
echo "After connecting, run the following commands:"
echo ""

echo -e "${YELLOW}STEP 2: Update System${NC}"
cat << 'EOF'
# Update system packages
apt update && apt upgrade -y

# Install required packages
apt install -y git nodejs npm curl wget htop nano ufw

# Install PM2 globally
npm install -g pm2

# Setup firewall
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 3000
ufw allow 9000
ufw --force enable
EOF

echo ""
echo -e "${YELLOW}STEP 3: Clone Project${NC}"
cat << 'EOF'
# Create project directory
mkdir -p /var/www
cd /var/www

# Clone the repository
git clone -b featues/v1 https://github.com/rsdgcxym007/boxing-ticket-frontend.git patongboxing-frontend
cd patongboxing-frontend

# Install dependencies
npm install

# Create environment file
cp .env.production .env

# Create logs directory
mkdir -p logs

# Make scripts executable
chmod +x scripts/*.sh
EOF

echo ""
echo -e "${YELLOW}STEP 4: Build and Start Application${NC}"
cat << 'EOF'
# Build the application
npm run build

# Start with PM2 using production ecosystem
pm2 start ecosystem.config.production.cjs --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup

# Check status
pm2 status
pm2 logs
EOF

echo ""
echo -e "${YELLOW}STEP 5: Setup GitHub Webhook${NC}"
cat << 'EOF'
# Test webhook server manually (optional)
node scripts/webhook-server-clean.js

# Or start with PM2 (recommended)
pm2 start ecosystem.config.production.cjs --only patong-boxing-webhook
EOF

echo ""
echo -e "${YELLOW}STEP 6: Configure GitHub Repository${NC}"
echo "In your GitHub repository settings:"
echo ""
echo "1. Go to Settings > Webhooks > Add webhook"
echo "2. Payload URL: http://43.229.133.51:9000/webhook"
echo "3. Content type: application/json"
echo "4. Secret: patong-boxing-webhook-secret-2025"
echo "5. Events: Just the push event"
echo "6. Active: ✅"
echo ""

echo -e "${YELLOW}STEP 7: Test Auto Deployment${NC}"
cat << 'EOF'
# Check webhook server logs
pm2 logs patong-boxing-webhook

# Check frontend logs
pm2 logs patong-boxing-frontend

# Monitor all processes
pm2 monit
EOF

echo ""
echo -e "${YELLOW}STEP 8: Nginx Configuration (Optional)${NC}"
cat << 'EOF'
# Install Nginx
apt install -y nginx

# Create Nginx config for frontend
cat > /etc/nginx/sites-available/patongboxing-frontend << 'EOL'
server {
    listen 80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOL

# Enable the site
ln -s /etc/nginx/sites-available/patongboxing-frontend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
systemctl enable nginx
EOF

echo ""
echo -e "${GREEN}🎉 READY FOR DEPLOYMENT!${NC}"
echo "========================"
echo ""
echo -e "${BLUE}📊 FINAL CHECKLIST:${NC}"
echo "□ VPS connected and updated"
echo "□ Project cloned and built"  
echo "□ PM2 processes running"
echo "□ Webhook server listening on port 9000"
echo "□ GitHub webhook configured"
echo "□ Discord notifications working"
echo "□ Firewall configured"
echo "□ (Optional) Nginx reverse proxy"
echo ""
echo -e "${YELLOW}🔗 USEFUL COMMANDS:${NC}"
echo "pm2 status              # Check all processes"
echo "pm2 logs                # View all logs"
echo "pm2 restart all         # Restart all processes"
echo "pm2 stop all           # Stop all processes"
echo "pm2 monit              # Real-time monitoring"
echo "curl http://localhost:3000  # Test frontend"
echo "curl http://localhost:9000  # Test webhook server"
echo ""
echo -e "${GREEN}Ready to connect to your VPS? Run:${NC}"
echo -e "${BLUE}ssh root@43.229.133.51${NC}"
echo ""
