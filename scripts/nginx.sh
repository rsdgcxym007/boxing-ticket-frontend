#!/bin/bash

# 🌐 Nginx Management Script for Patong Boxing Stadium
# Complete Nginx setup and management

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
NGINX_SITE_NAME="patongboxing"
NGINX_AVAILABLE="/etc/nginx/sites-available/$NGINX_SITE_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$NGINX_SITE_NAME"

echo -e "${PURPLE}🌐 Nginx Setup - Patong Boxing Stadium${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

show_help() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo ""
    echo -e "${BLUE}Commands:${NC}"
    echo -e "${GREEN}  install     ${NC} Install and configure Nginx"
    echo -e "${GREEN}  config      ${NC} Setup domain configuration"
    echo -e "${GREEN}  ssl         ${NC} Setup SSL certificates"
    echo -e "${GREEN}  restart     ${NC} Restart Nginx service"
    echo -e "${GREEN}  reload      ${NC} Reload Nginx configuration"
    echo -e "${GREEN}  test        ${NC} Test Nginx configuration"
    echo -e "${GREEN}  status      ${NC} Show Nginx status"
    echo -e "${GREEN}  logs        ${NC} Show Nginx logs"
    echo -e "${GREEN}  remove      ${NC} Remove domain configuration"
    echo -e "${GREEN}  backup      ${NC} Backup current configuration"
    echo -e "${GREEN}  restore     ${NC} Restore from backup"
    echo ""
    echo -e "${YELLOW}Examples:${NC}"
    echo -e "${BLUE}  $0 install    ${NC} # Full Nginx setup"
    echo -e "${BLUE}  $0 ssl        ${NC} # Setup SSL only"
    echo -e "${BLUE}  $0 test       ${NC} # Test configuration"
}

install_nginx() {
    echo -e "${YELLOW}📦 Installing Nginx...${NC}"
    
    sudo apt update
    sudo apt install -y nginx certbot python3-certbot-nginx
    
    # Enable and start Nginx
    sudo systemctl enable nginx
    sudo systemctl start nginx
    
    # Create backup directory
    sudo mkdir -p /etc/nginx/backups
    
    echo -e "${GREEN}✅ Nginx installed successfully${NC}"
}

create_nginx_config() {
    echo -e "${YELLOW}⚙️  Creating Nginx configuration...${NC}"
    
    # Backup existing configuration if it exists
    if [ -f "$NGINX_AVAILABLE" ]; then
        sudo cp "$NGINX_AVAILABLE" "/etc/nginx/backups/${NGINX_SITE_NAME}-$(date +%Y%m%d_%H%M%S).backup"
        echo -e "${BLUE}📦 Existing configuration backed up${NC}"
    fi
    
    # Create new configuration
    sudo tee "$NGINX_AVAILABLE" > /dev/null << 'NGINXCONF'
# Patong Boxing Stadium - Nginx Configuration
# Frontend: patongboxingstadiumticket.com
# Backend API: api-patongboxingstadiumticket.com

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=frontend:10m rate=30r/s;

# Frontend - patongboxingstadiumticket.com
server {
    listen 80;
    listen [::]:80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:;" always;
    
    # Rate limiting
    limit_req zone=frontend burst=20 nodelay;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
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
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        
        # Handle WebSocket connections
        proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;
        proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
    }
    
    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Backend API - api-patongboxingstadiumticket.com
server {
    listen 80;
    listen [::]:80;
    server_name api-patongboxingstadiumticket.com;
    
    # Security headers for API
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CORS headers
    add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Rate limiting for API
    limit_req zone=api burst=5 nodelay;
    
    # Handle preflight requests
    location / {
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 86400;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        
        # WebSocket support for API
        proxy_set_header Sec-WebSocket-Extensions $http_sec_websocket_extensions;
        proxy_set_header Sec-WebSocket-Key $http_sec_websocket_key;
        proxy_set_header Sec-WebSocket-Version $http_sec_websocket_version;
    }
    
    # API health check
    location /health {
        proxy_pass http://localhost:4000/health;
        proxy_set_header Host $host;
        access_log off;
    }
    
    # Block direct file access
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINXCONF
    
    echo -e "${GREEN}✅ Nginx configuration created${NC}"
}

enable_site() {
    echo -e "${YELLOW}🔗 Enabling site...${NC}"
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Enable our site
    sudo ln -sf "$NGINX_AVAILABLE" "$NGINX_ENABLED"
    
    echo -e "${GREEN}✅ Site enabled${NC}"
}

test_nginx() {
    echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
    
    if sudo nginx -t; then
        echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
        return 0
    else
        echo -e "${RED}❌ Nginx configuration has errors${NC}"
        return 1
    fi
}

setup_ssl() {
    echo -e "${YELLOW}🔒 Setting up SSL certificates...${NC}"
    
    # Test nginx config first
    if ! test_nginx; then
        echo -e "${RED}❌ Fix Nginx configuration before setting up SSL${NC}"
        return 1
    fi
    
    # Reload nginx
    sudo systemctl reload nginx
    
    # Get SSL certificates
    sudo certbot --nginx \
        -d "$FRONTEND_DOMAIN" \
        -d "www.$FRONTEND_DOMAIN" \
        -d "$BACKEND_DOMAIN" \
        --non-interactive \
        --agree-tos \
        --email "info@patongboxing.com" \
        --redirect || {
        echo -e "${YELLOW}⚠️  SSL setup failed. This might be due to DNS propagation.${NC}"
        echo -e "${BLUE}💡 You can retry later with: npm run nginx:ssl${NC}"
        return 1
    }
    
    # Setup auto-renewal
    sudo systemctl enable certbot.timer
    sudo systemctl start certbot.timer
    
    echo -e "${GREEN}✅ SSL certificates installed and auto-renewal enabled${NC}"
}

show_status() {
    echo -e "${YELLOW}📊 Nginx Status:${NC}"
    echo ""
    
    # Service status
    echo -e "${BLUE}Service Status:${NC}"
    sudo systemctl status nginx --no-pager -l
    
    echo ""
    
    # Test configuration
    echo -e "${BLUE}Configuration Test:${NC}"
    sudo nginx -t
    
    echo ""
    
    # SSL certificates
    echo -e "${BLUE}SSL Certificates:${NC}"
    sudo certbot certificates 2>/dev/null || echo "No certificates found"
    
    echo ""
    
    # Active connections
    echo -e "${BLUE}Active Connections:${NC}"
    sudo ss -tuln | grep :80
    sudo ss -tuln | grep :443
}

show_logs() {
    echo -e "${YELLOW}📝 Nginx Logs:${NC}"
    echo ""
    
    echo -e "${BLUE}Error Log (last 20 lines):${NC}"
    sudo tail -20 /var/log/nginx/error.log
    
    echo ""
    
    echo -e "${BLUE}Access Log (last 10 lines):${NC}"
    sudo tail -10 /var/log/nginx/access.log
}

backup_config() {
    echo -e "${YELLOW}📦 Backing up Nginx configuration...${NC}"
    
    BACKUP_NAME="nginx-backup-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    sudo tar -czf "/tmp/$BACKUP_NAME" \
        /etc/nginx/sites-available \
        /etc/nginx/sites-enabled \
        /etc/nginx/nginx.conf \
        2>/dev/null || true
    
    echo -e "${GREEN}✅ Backup created: /tmp/$BACKUP_NAME${NC}"
    echo -e "${BLUE}💡 Download with: scp user@server:/tmp/$BACKUP_NAME ./${NC}"
}

remove_config() {
    echo -e "${YELLOW}🗑️  Removing domain configuration...${NC}"
    
    read -p "Are you sure you want to remove the configuration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Cancelled${NC}"
        return
    fi
    
    # Backup before removing
    backup_config
    
    # Remove SSL certificates
    sudo certbot delete --cert-name "$FRONTEND_DOMAIN" 2>/dev/null || true
    
    # Remove site configuration
    sudo rm -f "$NGINX_ENABLED"
    sudo rm -f "$NGINX_AVAILABLE"
    
    # Test and reload
    sudo nginx -t && sudo systemctl reload nginx
    
    echo -e "${GREEN}✅ Configuration removed${NC}"
}

# Main script logic
case "${1:-help}" in
    "install")
        install_nginx
        ;;
    "config")
        create_nginx_config
        enable_site
        test_nginx
        sudo systemctl reload nginx
        echo -e "${GREEN}🎉 Nginx configuration completed!${NC}"
        ;;
    "ssl")
        setup_ssl
        ;;
    "restart")
        echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
        sudo systemctl restart nginx
        echo -e "${GREEN}✅ Nginx restarted${NC}"
        ;;
    "reload")
        echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
        test_nginx && sudo systemctl reload nginx
        echo -e "${GREEN}✅ Nginx reloaded${NC}"
        ;;
    "test")
        test_nginx
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "backup")
        backup_config
        ;;
    "remove")
        remove_config
        ;;
    "help"|*)
        show_help
        ;;
esac
