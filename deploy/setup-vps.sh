#!/bin/bash

# 📁 Setup VPS Directory Structure and Permissions
# This script creates the proper directory structure for the frontend deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="/var/www/frontend"
PROJECT_DIR="/var/www/frontend/boxing-ticket-frontend"
BACKUP_DIR="/var/backups/frontend"
LOG_DIR="/var/log/frontend"
USER=$(whoami)

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Create directories
create_directories() {
    log_info "Creating directory structure..."
    
    # Create main directories
    sudo mkdir -p "$FRONTEND_DIR"
    sudo mkdir -p "$BACKUP_DIR"
    sudo mkdir -p "$LOG_DIR"
    
    log_success "Directories created successfully"
}

# Set permissions
set_permissions() {
    log_info "Setting up permissions..."
    
    # Set ownership to current user
    sudo chown -R "$USER:$USER" "$FRONTEND_DIR"
    sudo chown -R "$USER:$USER" "$BACKUP_DIR"
    sudo chown -R "$USER:$USER" "$LOG_DIR"
    
    # Set proper permissions
    chmod -R 755 "$FRONTEND_DIR"
    chmod -R 755 "$BACKUP_DIR"
    chmod -R 755 "$LOG_DIR"
    
    log_success "Permissions set successfully"
}

# Clone repository (if not exists)
clone_repository() {
    if [ ! -d "$PROJECT_DIR" ]; then
        log_info "Cloning repository..."
        
        cd "$FRONTEND_DIR"
        git clone https://github.com/rsdgcxym007/boxing-ticket-frontend.git
        
        cd "$PROJECT_DIR"
        git checkout featues/v1
        
        log_success "Repository cloned successfully"
    else
        log_warning "Repository already exists at $PROJECT_DIR"
    fi
}

# Create environment file
create_env_file() {
    log_info "Creating environment file..."
    
    if [ ! -f "$PROJECT_DIR/.env.production" ]; then
        cat > "$PROJECT_DIR/.env.production" << EOF
# Production Environment Configuration
NODE_ENV=production
NUXT_APP_BASE_URL=http://43.229.133.51:3000
NUXT_PUBLIC_API_BASE=http://43.229.133.51:8000/api
NUXT_PUBLIC_STORAGE_URL=http://43.229.133.51:8000/storage

# Application Settings
NUXT_APP_NAME="Boxing Ticket System"
NUXT_APP_VERSION="1.0.0"

# Security
NUXT_SECRET_KEY="your-secret-key-here"
NUXT_JWT_SECRET="your-jwt-secret-here"

# Database (if needed)
# DATABASE_URL="your-database-url"

# Third-party APIs
# NUXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-key"
# NUXT_PUBLIC_STRIPE_PUBLIC_KEY="your-stripe-public-key"
EOF
        
        log_success "Environment file created"
        log_warning "Please update .env.production with your actual configuration"
    else
        log_warning "Environment file already exists"
    fi
}

# Create PM2 ecosystem file
create_ecosystem_file() {
    log_info "Creating PM2 ecosystem file..."
    
    if [ ! -f "$PROJECT_DIR/ecosystem.config.js" ]; then
        cat > "$PROJECT_DIR/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [{
    name: 'boxing-ticket-frontend',
    port: '3000',
    exec_mode: 'cluster',
    instances: 'max',
    script: './.output/server/index.mjs',
    args: '',
    cwd: '/var/www/frontend/boxing-ticket-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NITRO_HOST: '0.0.0.0',
      NITRO_PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NITRO_HOST: '0.0.0.0',
      NITRO_PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/log/frontend/error.log',
    out_file: '/var/log/frontend/out.log',
    log_file: '/var/log/frontend/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF
        
        log_success "PM2 ecosystem file created"
    else
        log_warning "PM2 ecosystem file already exists"
    fi
}

# Create health check endpoint
create_health_check() {
    log_info "Creating health check script..."
    
    cat > "/var/log/frontend/health-check.sh" << 'EOF'
#!/bin/bash

# Health check for Boxing Ticket Frontend
HEALTH_URL="http://localhost:3000/health"
MAX_ATTEMPTS=3
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
        echo "✅ Application is healthy"
        exit 0
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo "⚠️ Health check attempt $ATTEMPT/$MAX_ATTEMPTS failed"
    sleep 2
done

echo "❌ Application is not responding after $MAX_ATTEMPTS attempts"
exit 1
EOF
    
    chmod +x "/var/log/frontend/health-check.sh"
    log_success "Health check script created"
}

# Create systemd service for webhook
create_webhook_service() {
    log_info "Creating webhook systemd service..."
    
    sudo tee /etc/systemd/system/boxing-webhook.service > /dev/null << EOF
[Unit]
Description=Boxing Ticket Frontend Webhook Handler
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/bin/bash $PROJECT_DIR/deploy/webhook-handler.sh
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=boxing-webhook

[Install]
WantedBy=multi-user.target
EOF
    
    # Reload systemd and enable service
    sudo systemctl daemon-reload
    sudo systemctl enable boxing-webhook.service
    
    log_success "Webhook service created and enabled"
}

# Show final instructions
show_instructions() {
    echo ""
    log_success "🎉 VPS setup completed successfully!"
    echo ""
    echo -e "${BLUE}📁 Directory Structure:${NC}"
    echo "  Frontend: $FRONTEND_DIR"
    echo "  Project:  $PROJECT_DIR"
    echo "  Backups:  $BACKUP_DIR"
    echo "  Logs:     $LOG_DIR"
    echo ""
    echo -e "${BLUE}🚀 Next Steps:${NC}"
    echo "1. Update .env.production with your configuration"
    echo "2. Install dependencies: cd $PROJECT_DIR && npm install"
    echo "3. Build application: npm run build"
    echo "4. Start with PM2: pm2 start ecosystem.config.js --env production"
    echo "5. Start webhook: sudo systemctl start boxing-webhook"
    echo ""
    echo -e "${BLUE}📝 Useful Commands:${NC}"
    echo "  Deploy:           cd $PROJECT_DIR && bash deploy.sh"
    echo "  Check status:     pm2 status"
    echo "  View logs:        pm2 logs boxing-ticket-frontend"
    echo "  Health check:     bash /var/log/frontend/health-check.sh"
    echo "  Webhook status:   sudo systemctl status boxing-webhook"
    echo ""
    echo -e "${YELLOW}⚠️ Important:${NC}"
    echo "- Make sure port 3000 is open for the application"
    echo "- Make sure port 4100 is open for webhooks"
    echo "- Update firewall rules if necessary"
    echo ""
}

# Main execution
main() {
    log_info "🚀 Starting VPS setup for Boxing Ticket Frontend..."
    echo ""
    
    create_directories
    set_permissions
    clone_repository
    create_env_file
    create_ecosystem_file
    create_health_check
    create_webhook_service
    
    show_instructions
}

# Run main function
main "$@"
