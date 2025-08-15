#!/bin/bash

# 🚀 Auto Deploy Script for Domain Setup
# สำหรับ Patong Boxing Stadium Ticket - patongboxingstadiumticket.com

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="patongboxingstadiumticket.com"
VPS_IP="43.229.133.51"
FRONTEND_PORT="3000"
BACKEND_PORT="4000"
PROJECT_DIR="/var/www/patongboxing"
NGINX_SITE="/etc/nginx/sites-available/$DOMAIN"

echo -e "${BLUE}🌐 Starting Domain Setup for $DOMAIN${NC}"
echo "=========================================="

# Function to print status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_warning "Running as root user"
    else
        print_warning "Some commands may require sudo"
    fi
}

# Function to check if domain resolves to our IP
check_dns() {
    echo -e "${BLUE}🔍 Checking DNS resolution for $DOMAIN...${NC}"
    
    RESOLVED_IP=$(dig +short $DOMAIN)
    if [[ "$RESOLVED_IP" == "$VPS_IP" ]]; then
        print_status "DNS correctly points to $VPS_IP"
        return 0
    else
        print_error "DNS does not point to $VPS_IP (currently: $RESOLVED_IP)"
        print_warning "Please wait for DNS propagation or check DNS settings"
        return 1
    fi
}

# Function to install required packages
install_packages() {
    echo -e "${BLUE}📦 Installing required packages...${NC}"
    
    # Update package list
    sudo apt update
    
    # Install nginx if not present
    if ! command -v nginx &> /dev/null; then
        echo "Installing Nginx..."
        sudo apt install nginx -y
        sudo systemctl enable nginx
        print_status "Nginx installed"
    else
        print_status "Nginx already installed"
    fi
    
    # Install certbot if not present
    if ! command -v certbot &> /dev/null; then
        echo "Installing Certbot..."
        sudo apt install certbot python3-certbot-nginx -y
        print_status "Certbot installed"
    else
        print_status "Certbot already installed"
    fi
    
    # Install Node.js and npm if not present
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
        print_status "Node.js installed"
    else
        print_status "Node.js already installed ($(node --version))"
    fi
    
    # Install PM2 if not present
    if ! command -v pm2 &> /dev/null; then
        echo "Installing PM2..."
        sudo npm install -g pm2
        print_status "PM2 installed"
    else
        print_status "PM2 already installed"
    fi
}

# Function to create project directory
create_project_dir() {
    echo -e "${BLUE}📁 Setting up project directory...${NC}"
    
    if [[ ! -d "$PROJECT_DIR" ]]; then
        sudo mkdir -p $PROJECT_DIR
        sudo chown -R $USER:$USER $PROJECT_DIR
        print_status "Project directory created: $PROJECT_DIR"
    else
        print_status "Project directory exists: $PROJECT_DIR"
    fi
}

# Function to setup Nginx configuration
setup_nginx() {
    echo -e "${BLUE}⚙️  Setting up Nginx configuration...${NC}"
    
    # Create nginx site configuration
    sudo tee $NGINX_SITE > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Static files (if any)
    location /assets/ {
        alias $PROJECT_DIR/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /_nuxt/ {
        alias $PROJECT_DIR/.output/public/_nuxt/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Routes - Proxy ไปยัง Nest.js Backend (Port 4000)
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Main application proxy - Frontend Nuxt.js (Port 3000)
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
EOF

    # Enable site
    sudo ln -sf $NGINX_SITE /etc/nginx/sites-enabled/
    
    # Remove default site if exists
    if [[ -f /etc/nginx/sites-enabled/default ]]; then
        sudo rm /etc/nginx/sites-enabled/default
        print_status "Removed default Nginx site"
    fi
    
    # Test nginx configuration
    if sudo nginx -t; then
        print_status "Nginx configuration is valid"
        sudo systemctl reload nginx
        print_status "Nginx reloaded"
    else
        print_error "Nginx configuration test failed"
        exit 1
    fi
}

# Function to setup SSL certificate
setup_ssl() {
    echo -e "${BLUE}🔒 Setting up SSL certificate...${NC}"
    
    # Check if DNS is working first
    if ! check_dns; then
        print_error "DNS not ready. Please run SSL setup manually after DNS propagation."
        return 1
    fi
    
    # Get SSL certificate
    sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN --redirect
    
    if [[ $? -eq 0 ]]; then
        print_status "SSL certificate installed successfully"
        
        # Setup auto-renewal
        (sudo crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
        print_status "SSL auto-renewal configured"
    else
        print_error "SSL certificate installation failed"
        return 1
    fi
}

# Function to create environment file
create_env_file() {
    echo -e "${BLUE}🔧 Creating environment configuration...${NC}"
    
    cat > $PROJECT_DIR/.env.production <<EOF
# App Configuration
NODE_ENV=production
NUXT_HOST=0.0.0.0
NUXT_PORT=$FRONTEND_PORT

# Domain และ URL
DOMAIN=$DOMAIN
NUXT_PUBLIC_APP_URL=https://$DOMAIN
NUXT_PUBLIC_API_BASE_URL=https://$DOMAIN
NUXT_PUBLIC_BACKEND_URL=https://$DOMAIN
APP_BASE_URL=https://$DOMAIN

# API Configuration
API_BASE_URL=https://$DOMAIN
BACKEND_URL=https://$DOMAIN:$BACKEND_PORT
BACKEND_PORT=$BACKEND_PORT

# Database (กรุณาแก้ไขตามจริง)
DATABASE_URL=postgresql://username:password@localhost:5432/boxing_tickets
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boxing_tickets
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT และ Security (กรุณาเปลี่ยนค่าเหล่านี้)
JWT_SECRET=your_jwt_secret_key_here
ENCRYPT_KEY=your_encryption_key_here
HASH_SALT=your_hash_salt_here

# QR Code Configuration
QR_ENCRYPTION_KEY=your_qr_encryption_key_here
QR_EXPIRE_HOURS=24

# Email Configuration (กรุณาแก้ไขตามจริง)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (ถ้ามี)
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET=your_payment_secret
EOF

    print_status "Environment file created at $PROJECT_DIR/.env.production"
    print_warning "Please edit $PROJECT_DIR/.env.production with your actual values"
}

# Function to create PM2 ecosystem file
create_pm2_config() {
    echo -e "${BLUE}⚙️  Creating PM2 configuration...${NC}"
    
    cat > $PROJECT_DIR/ecosystem.config.cjs <<EOF
module.exports = {
  apps: [
    {
      name: 'patong-boxing-frontend',
      port: $FRONTEND_PORT,
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      cwd: '$PROJECT_DIR',
      env: {
        NODE_ENV: 'production',
        NUXT_HOST: '0.0.0.0',
        NUXT_PORT: $FRONTEND_PORT,
        DOMAIN: '$DOMAIN'
      },
      env_production: {
        NODE_ENV: 'production',
        NUXT_PUBLIC_APP_URL: 'https://$DOMAIN',
        NUXT_PUBLIC_API_BASE_URL: 'https://$DOMAIN',
        NUXT_PUBLIC_BACKEND_URL: 'https://$DOMAIN'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: '$PROJECT_DIR/logs/frontend-err.log',
      out_file: '$PROJECT_DIR/logs/frontend-out.log',
      log_file: '$PROJECT_DIR/logs/frontend-combined.log',
      time: true,
      max_restarts: 10,
      restart_delay: 4000
    }
  ]
};
EOF

    # Create logs directory
    mkdir -p $PROJECT_DIR/logs
    
    print_status "PM2 configuration created"
}

# Function to deploy application
deploy_application() {
    echo -e "${BLUE}🚀 Deploying application...${NC}"
    
    cd $PROJECT_DIR
    
    # If git repo doesn't exist, clone it
    if [[ ! -d ".git" ]]; then
        print_warning "No git repository found. Please clone your repository manually:"
        echo "cd $PROJECT_DIR"
        echo "git clone https://github.com/your-username/boxing-ticket-frontend.git ."
        return 1
    fi
    
    # Pull latest changes
    git pull origin main
    
    # Install dependencies
    npm ci --production
    
    # Build application
    npm run build
    
    # Stop existing PM2 processes
    pm2 delete all 2>/dev/null || true
    
    # Start application with PM2
    pm2 start ecosystem.config.cjs --env production
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    print_status "Application deployed successfully"
}

# Function to verify deployment
verify_deployment() {
    echo -e "${BLUE}✅ Verifying deployment...${NC}"
    
    # Check if application is running
    if pm2 status | grep -q "patong-boxing-frontend"; then
        print_status "PM2 application is running"
    else
        print_error "PM2 application is not running"
        return 1
    fi
    
    # Check if port is listening
    if netstat -tulpn | grep -q ":$FRONTEND_PORT"; then
        print_status "Frontend application listening on port $FRONTEND_PORT"
    else
        print_error "Frontend application not listening on port $FRONTEND_PORT"
        return 1
    fi
    
    # Check Nginx status
    if systemctl is-active --quiet nginx; then
        print_status "Nginx is active"
    else
        print_error "Nginx is not active"
        return 1
    fi
    
    # Test HTTP response (if DNS is ready)
    if check_dns; then
        echo "Testing HTTP response..."
        if curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN | grep -q "200\|301\|302"; then
            print_status "HTTP response successful"
        else
            print_warning "HTTP response test failed (might be normal if SSL redirect is working)"
        fi
        
        # Test HTTPS response
        if curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN | grep -q "200"; then
            print_status "HTTPS response successful"
        else
            print_warning "HTTPS response test failed"
        fi
    fi
}

# Function to display next steps
show_next_steps() {
    echo ""
    echo -e "${GREEN}🎉 Domain setup completed!${NC}"
    echo "=========================================="
    echo ""
    echo -e "${BLUE}📝 Next Steps:${NC}"
    echo ""
    echo "1. 🔧 Edit environment variables:"
    echo "   sudo nano $PROJECT_DIR/.env.production"
    echo ""
    echo "2. 🗄️  Set up your database connection"
    echo ""
    echo "3. 📧 Configure email settings"
    echo ""
    echo "4. 🔑 Update JWT and encryption keys"
    echo ""
    echo "5. 🚀 Restart the application:"
    echo "   cd $PROJECT_DIR"
    echo "   pm2 restart all"
    echo ""
    echo -e "${BLUE}📊 Monitoring Commands:${NC}"
    echo "   pm2 status          - Check application status"
    echo "   pm2 logs            - View application logs"
    echo "   pm2 monit           - Real-time monitoring"
    echo "   sudo systemctl status nginx - Check Nginx status"
    echo ""
    echo -e "${BLUE}🌐 Test URLs:${NC}"
    echo "   https://$DOMAIN"
    echo "   https://$DOMAIN/mobile"
    echo "   https://$DOMAIN/admin"
    echo "   https://$DOMAIN/api/v1/health"
    echo ""
    echo -e "${GREEN}✅ Setup completed successfully!${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}🚀 Starting automated domain setup for $DOMAIN${NC}"
    echo ""
    
    check_root
    
    # Confirm before proceeding
    read -p "Do you want to proceed with the setup? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    echo ""
    echo "Starting setup process..."
    echo ""
    
    # Execute setup steps
    install_packages
    create_project_dir
    setup_nginx
    create_env_file
    create_pm2_config
    
    # Try to setup SSL (might fail if DNS not ready)
    if check_dns; then
        setup_ssl
    else
        print_warning "Skipping SSL setup - DNS not ready"
        echo "Run this command later: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
    
    # Deploy application (if git repo exists)
    deploy_application
    
    # Verify deployment
    verify_deployment
    
    # Show next steps
    show_next_steps
}

# Run main function
main "$@"
