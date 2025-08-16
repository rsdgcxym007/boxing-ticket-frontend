#!/bin/bash
# 🥊 Patong Boxing Stadium - Production Deployment Script
# Auto Deploy with GitHub Webhook Integration
# Path: /var/www/patongboxing-frontend/scripts/webhook-deploy.sh

set -e

# Configuration
LOG_FILE="/var/log/patongboxing-deploy.log"
PROJECT_DIR="/var/www/patongboxing-frontend"
BACKUP_DIR="/var/backups/patongboxing-frontend"
PM2_APP_NAME="boxing-ticket-frontend"
BRANCH="featues/v1"
NODE_MODULES_BACKUP="node_modules_backup_$(date +%Y%m%d_%H%M%S)"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send Discord notification
send_discord_notification() {
    local message="$1"
    local webhook_url="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
    
    if [ ! -z "$webhook_url" ]; then
        curl -H "Content-Type: application/json" \
             -X POST \
             -d "{\"content\":\"🥊 **Patong Boxing Frontend**: $message\"}" \
             "$webhook_url" 2>/dev/null || true
    fi
}

# Create backup
create_backup() {
    log_message "Creating backup..."
    mkdir -p "$BACKUP_DIR"
    
    if [ -d "$PROJECT_DIR" ]; then
        backup_name="backup-$(date +%Y%m%d-%H%M%S)"
        tar -czf "$BACKUP_DIR/$backup_name.tar.gz" -C "$PROJECT_DIR" . 2>/dev/null || true
        log_message "Backup created: $backup_name.tar.gz"
    fi
}

# Deploy function
deploy() {
    log_message "🚀 Starting auto deployment..."
    send_discord_notification "🔄 Auto deployment started..."
    
    cd "$PROJECT_DIR" || exit 1
    
    # Clean up old builds and modules
    log_message "Cleaning up old builds..."
    rm -rf .output .nuxt dist 2>/dev/null || true
    
    # Backup node_modules if exists
    if [ -d "node_modules" ]; then
        log_message "Backing up node_modules..."
        mv node_modules "$NODE_MODULES_BACKUP" 2>/dev/null || true
    fi
    
    # Pull latest changes
    log_message "Pulling latest changes from GitHub..."
    git fetch origin
    git reset --hard origin/$BRANCH
    git clean -fd
    
    # Restore node_modules if backup exists
    if [ -d "$NODE_MODULES_BACKUP" ]; then
        log_message "Restoring node_modules..."
        mv "$NODE_MODULES_BACKUP" node_modules 2>/dev/null || true
    fi
    
    # Fresh install dependencies
    log_message "Installing dependencies..."
    npm ci --production=false
    
    # Build application
    log_message "Building application..."
    npm run build
    
    # Restart PM2 process
    log_message "Restarting PM2 processes..."
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    pm2 startOrRestart ecosystem.config.cjs --env production
    pm2 save
    
    # Cleanup old backups in node_modules
    find . -maxdepth 1 -name "node_modules_backup_*" -type d -mtime +7 -exec rm -rf {} + 2>/dev/null || true
    
    # Health check
    sleep 5
    if pm2 list | grep -q "online.*$PM2_APP_NAME"; then
        log_message "✅ Deployment successful!"
        send_discord_notification "✅ Deployment successful! Frontend is online."
    else
        log_message "❌ Deployment failed - PM2 process not online"
        send_discord_notification "❌ Deployment failed - PM2 process not online"
        exit 1
    fi
}

# Main execution
main() {
    log_message "=== GitHub Webhook Triggered ==="
    
    # Ensure log directory exists
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Create backup before deployment
    create_backup
    
    # Perform deployment
    deploy
    
    log_message "=== Deployment Complete ==="
}

# Execute if run directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
# Force update deployment script Sun Aug 17 01:28:57 +07 2025
