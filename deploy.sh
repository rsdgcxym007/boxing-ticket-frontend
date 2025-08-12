#!/bin/bash

# 🚀 Boxing Ticket Frontend - VPS Deployment Script
# Auto deployment with Discord notifications

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="Boxing Ticket Frontend"
APP_DIR="/var/www/frontend/boxing-ticket-frontend"
PM2_APP_NAME="boxing-ticket-frontend"
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
BRANCH="featues/v1"
NODE_VERSION="18"

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

# Send Discord notification
send_discord_notification() {
    local status="$1"
    local message="$2"
    local color="$3"
    
    if [ -z "$DISCORD_WEBHOOK" ]; then
        log_warning "Discord webhook not configured"
        return
    fi

    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local hostname=$(hostname)
    local user=$(whoami)
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{
             \"embeds\": [{
                 \"title\": \"🎫 $PROJECT_NAME Deployment\",
                 \"description\": \"$message\",
                 \"color\": $color,
                 \"timestamp\": \"$timestamp\",
                 \"fields\": [
                     {
                         \"name\": \"Status\",
                         \"value\": \"$status\",
                         \"inline\": true
                     },
                     {
                         \"name\": \"Server\",
                         \"value\": \"$hostname\",
                         \"inline\": true
                     },
                     {
                         \"name\": \"User\",
                         \"value\": \"$user\",
                         \"inline\": true
                     },
                     {
                         \"name\": \"Branch\",
                         \"value\": \"$BRANCH\",
                         \"inline\": true
                     },
                     {
                         \"name\": \"Time\",
                         \"value\": \"$(date)\",
                         \"inline\": false
                     }
                 ],
                 \"footer\": {
                     \"text\": \"VPS Auto Deployment\"
                 }
             }]
         }" \
         "$DISCORD_WEBHOOK" > /dev/null 2>&1 || log_warning "Failed to send Discord notification"
}

# Check if running as root
check_permissions() {
    if [ "$EUID" -eq 0 ]; then
        log_warning "Running as root - this is not recommended in production!"
        log_warning "Consider creating a dedicated user for deployment"
        sleep 2
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt "$NODE_VERSION" ]; then
        log_error "Node.js version $NODE_VERSION+ is required. Current: $(node -v)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
    
    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        log_error "PM2 is not installed. Install with: npm install -g pm2"
        exit 1
    fi
    
    # Check if git is installed
    if ! command -v git &> /dev/null; then
        log_error "Git is not installed"
        exit 1
    fi
    
    log_success "All prerequisites are met"
}

# Backup current deployment
backup_current() {
    log_info "Creating backup of current deployment..."
    
    if [ -d "$APP_DIR" ]; then
        local backup_dir="/var/backups/frontend/boxing-ticket-frontend-$(date +%Y%m%d-%H%M%S)"
        sudo mkdir -p /var/backups/frontend
        sudo cp -r "$APP_DIR" "$backup_dir" 2>/dev/null || true
        log_success "Backup created at $backup_dir"
    else
        log_warning "No existing deployment to backup"
    fi
}

# Pull latest code
pull_code() {
    log_info "Pulling latest code from repository..."
    
    cd "$APP_DIR"
    
    # Stash any local changes
    git stash push -m "Auto-stash before deployment $(date)" || true
    
    # Pull latest code
    git fetch origin
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
    
    local commit_hash=$(git rev-parse --short HEAD)
    local commit_message=$(git log -1 --pretty=%B)
    
    log_success "Code updated to commit: $commit_hash"
    log_info "Commit message: $commit_message"
    
    echo "$commit_hash" > .deployment-info
    echo "$(date)" >> .deployment-info
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies..."
    
    cd "$APP_DIR"
    
    # Clear npm cache
    npm cache clean --force
    
    # Install production dependencies
    npm ci --production=false
    
    log_success "Dependencies installed"
}

# Build application
build_application() {
    log_info "Building application..."
    
    cd "$APP_DIR"
    
    # Copy production environment
    if [ -f ".env.production" ]; then
        cp .env.production .env
        log_info "Using production environment configuration"
    fi
    
    # Build the application
    npm run build
    
    log_success "Application built successfully"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    # Wait for application to start
    sleep 10
    
    # Check if application is responding
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:3000/health > /dev/null 2>&1; then
            log_success "Health check passed"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log_info "Health check attempt $attempt/$max_attempts..."
        sleep 2
    done
    
    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Start/Restart PM2 application
manage_pm2() {
    log_info "Managing PM2 application..."
    
    cd "$APP_DIR"
    
    # Check if PM2 app exists
    if pm2 describe "$PM2_APP_NAME" > /dev/null 2>&1; then
        log_info "Restarting existing PM2 application..."
        pm2 restart "$PM2_APP_NAME"
    else
        log_info "Starting new PM2 application..."
        pm2 start ecosystem.config.js --env production
    fi
    
    # Save PM2 configuration
    pm2 save
    
    log_success "PM2 application managed successfully"
}

# Cleanup old deployments
cleanup() {
    log_info "Cleaning up old deployments..."
    
    # Remove old node_modules if exists
    cd "$APP_DIR"
    
    # Clear build cache
    rm -rf .nuxt .output dist || true
    
    # Keep only last 5 backups
    sudo find /var/backups/frontend -name "boxing-ticket-frontend-*" -type d | sort -r | tail -n +6 | xargs -r sudo rm -rf
    
    log_success "Cleanup completed"
}

# Main deployment function
deploy() {
    local start_time=$(date +%s)
    
    log_info "🚀 Starting deployment of $PROJECT_NAME..."
    send_discord_notification "🚀 STARTING" "Deployment started on $(hostname)" "16776960"
    
    # Set up error handling
    trap 'deploy_failed' ERR
    
    # Run deployment steps
    check_permissions
    check_prerequisites
    backup_current
    pull_code
    install_dependencies
    cleanup
    build_application
    manage_pm2
    
    # Wait and perform health check
    if health_check; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        log_success "🎉 Deployment completed successfully in ${duration}s!"
        send_discord_notification "✅ SUCCESS" "Deployment completed successfully in ${duration}s" "65280"
        
        # Show application info
        log_info "Application Status:"
        pm2 describe "$PM2_APP_NAME" | grep -E "(status|uptime|memory|cpu)"
        
        log_info "Application URL: http://43.229.133.51:3000"
        log_info "Health Check: http://43.229.133.51:3000/health"
        
    else
        deploy_failed
    fi
}

# Handle deployment failure
deploy_failed() {
    log_error "💥 Deployment failed!"
    send_discord_notification "❌ FAILED" "Deployment failed on $(hostname). Check logs for details." "16711680"
    
    # Try to rollback to previous version
    log_info "Attempting to rollback..."
    pm2 restart "$PM2_APP_NAME" || true
    
    exit 1
}

# Show help
show_help() {
    echo "Boxing Ticket Frontend - VPS Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  deploy          Start deployment process (default)"
    echo "  status          Show application status"
    echo "  logs            Show application logs"
    echo "  restart         Restart application"
    echo "  stop            Stop application"
    echo "  health          Check application health"
    echo "  backup          Create manual backup"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy       # Deploy application"
    echo "  $0 status       # Show PM2 status"
    echo "  $0 logs         # Show application logs"
}

# Handle different commands
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    status)
        pm2 describe "$PM2_APP_NAME" 2>/dev/null || echo "Application not running"
        ;;
    logs)
        pm2 logs "$PM2_APP_NAME"
        ;;
    restart)
        pm2 restart "$PM2_APP_NAME"
        ;;
    stop)
        pm2 stop "$PM2_APP_NAME"
        ;;
    health)
        if curl -s http://localhost:3000/health > /dev/null; then
            echo "✅ Application is healthy"
        else
            echo "❌ Application is not responding"
        fi
        ;;
    backup)
        backup_current
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
