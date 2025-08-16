#!/bin/bash
# GitHub Webhook Handler for Auto Deploy
# Path: /var/www/patongboxing-frontend/webhook-deploy.sh

set -e

LOG_FILE="/var/log/patongboxing-deploy.log"
PROJECT_DIR="/var/www/patongboxing-frontend/source"
BACKUP_DIR="/var/backups/patongboxing-frontend"

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
    
    # Pull latest changes
    log_message "Pulling latest changes from GitHub..."
    git fetch origin
    git reset --hard origin/featues/v1
    
    # Install dependencies
    log_message "Installing dependencies..."
    npm ci --production=false
    
    # Build application
    log_message "Building application..."
    npm run build
    
    # Restart PM2 process
    log_message "Restarting PM2 processes..."
    pm2 startOrRestart ecosystem.config.cjs --env production
    pm2 save
    
    # Health check
    sleep 5
    if pm2 list | grep -q "online.*boxing-ticket-frontend"; then
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
