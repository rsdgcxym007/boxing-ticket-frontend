#!/bin/bash

# 🌐 Domain Setup Script for Patong Boxing Stadium
# Configures DNS, SSL, and Nginx for both domains

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
EMAIL="info@patongboxing.com"

echo -e "${PURPLE}🌐 Domain Setup - Patong Boxing Stadium${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "${YELLOW}📋 This script will help you set up:${NC}"
echo -e "${BLUE}• Frontend: $FRONTEND_DOMAIN${NC}"
echo -e "${BLUE}• Backend API: $BACKEND_DOMAIN${NC}"
echo -e "${BLUE}• SSL certificates${NC}"
echo -e "${BLUE}• Nginx configuration${NC}"
echo ""

# Step 1: DNS Check
echo -e "${YELLOW}🔍 Step 1: Checking DNS configuration...${NC}"

check_dns() {
    local domain=$1
    local expected_ip=$2
    
    echo -n "Checking $domain... "
    actual_ip=$(dig +short $domain | tail -n1)
    
    if [ "$actual_ip" = "$expected_ip" ]; then
        echo -e "${GREEN}✅ OK${NC} ($actual_ip)"
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Expected: $expected_ip, Got: ${actual_ip:-'No response'})"
        return 1
    fi
}

dns_ok=true
check_dns $FRONTEND_DOMAIN $VPS_IP || dns_ok=false
check_dns "www.$FRONTEND_DOMAIN" $VPS_IP || dns_ok=false  
check_dns $BACKEND_DOMAIN $VPS_IP || dns_ok=false

if [ "$dns_ok" = false ]; then
    echo ""
    echo -e "${RED}❌ DNS configuration issues detected!${NC}"
    echo -e "${YELLOW}📝 Please add these DNS records:${NC}"
    echo ""
    echo -e "${BLUE}A Record    | $FRONTEND_DOMAIN     | $VPS_IP${NC}"
    echo -e "${BLUE}A Record    | www.$FRONTEND_DOMAIN | $VPS_IP${NC}"
    echo -e "${BLUE}A Record    | $BACKEND_DOMAIN      | $VPS_IP${NC}"
    echo ""
    echo -e "${YELLOW}⏳ DNS propagation can take up to 24 hours.${NC}"
    echo -e "${YELLOW}💡 You can continue setup, but SSL may fail until DNS is ready.${NC}"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Exiting. Please fix DNS first.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ DNS configuration looks good!${NC}"
fi

# Step 2: VPS Setup
echo -e "${YELLOW}⚙️  Step 2: Setting up VPS configuration...${NC}"

ssh $VPS_USER@$VPS_IP << EOF
    # Update system
    echo "📦 Updating system packages..."
    sudo apt update && sudo apt upgrade -y
    
    # Install required packages
    echo "📦 Installing required packages..."
    sudo apt install -y nginx certbot python3-certbot-nginx curl git nodejs npm
    
    # Setup Nginx configuration
    echo "🌐 Setting up Nginx configuration..."
    sudo tee /etc/nginx/sites-available/patongboxing > /dev/null << 'NGINXCONF'
# Frontend - patongboxingstadiumticket.com
server {
    listen 80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
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
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}

# Backend API - api-patongboxingstadiumticket.com
server {
    listen 80;
    server_name api-patongboxingstadiumticket.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    # CORS headers for API
    add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization" always;
    
    location / {
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
NGINXCONF
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/patongboxing /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    echo "✅ Nginx configuration completed"
EOF

# Step 3: SSL Setup
echo -e "${YELLOW}🔒 Step 3: Setting up SSL certificates...${NC}"

ssh $VPS_USER@$VPS_IP << EOF
    echo "🔒 Obtaining SSL certificates..."
    
    # Get certificates for all domains
    sudo certbot --nginx \
        -d $FRONTEND_DOMAIN \
        -d www.$FRONTEND_DOMAIN \
        -d $BACKEND_DOMAIN \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        --redirect || {
        echo "⚠️  SSL setup failed. This is normal if DNS is still propagating."
        echo "💡 You can retry SSL setup later with: sudo certbot --nginx"
    }
    
    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    echo "✅ SSL setup completed"
EOF

# Step 4: Final verification
echo -e "${YELLOW}🔍 Step 4: Final verification...${NC}"

echo -e "${BLUE}Testing HTTP redirects...${NC}"
for domain in $FRONTEND_DOMAIN $BACKEND_DOMAIN; do
    echo -n "Testing $domain... "
    response=$(curl -s -I "http://$domain" | head -n1)
    if [[ $response == *"301"* ]] || [[ $response == *"200"* ]]; then
        echo -e "${GREEN}✅ OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Check manually${NC}"
    fi
done

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 Domain setup completed!${NC}"
echo ""
echo -e "${CYAN}🌐 Your domains are configured:${NC}"
echo -e "${BLUE}📱 Frontend: https://$FRONTEND_DOMAIN${NC}"
echo -e "${BLUE}🔗 Backend API: https://$BACKEND_DOMAIN${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "${BLUE}1. Deploy your applications with: npm run deploy:full${NC}"
echo -e "${BLUE}2. Test your domains: npm run health-check${NC}"
echo -e "${BLUE}3. Monitor with: npm run pm2:status${NC}"
echo ""
echo -e "${YELLOW}🔧 Troubleshooting:${NC}"
echo -e "${BLUE}• Check SSL: sudo certbot certificates${NC}"
echo -e "${BLUE}• Renew SSL: sudo certbot renew${NC}"
echo -e "${BLUE}• Check Nginx: sudo nginx -t${NC}"
echo -e "${BLUE}• Nginx logs: sudo tail -f /var/log/nginx/error.log${NC}"
