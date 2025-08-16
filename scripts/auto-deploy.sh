#!/bin/bash

# =============================================================================
# Patong Boxing Stadium - Auto Deploy Script with Discord Notifications
# =============================================================================

set -e  # Exit on any error

# Configuration
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
PROJECT_NAME="Patong Boxing Stadium Frontend"
PROJECT_PATH="/var/www/patongboxing-frontend"
PM2_APP_NAME="boxing-ticket-frontend"
REPO_URL="https://github.com/rsdgcxym007/boxing-ticket-frontend.git"
BRANCH="featues/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Discord notification function
send_discord_notification() {
    local message="$1"
    local color="$2"
    local status="$3"
    
    # Default color if not provided
    if [ -z "$color" ]; then
        color="3447003"  # Blue
    fi
    
    local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local hostname=$(hostname)
    local user=$(whoami)
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{
             \"embeds\": [{
                 \"title\": \"🥊 ${PROJECT_NAME} - ${status}\",
                 \"description\": \"${message}\",
                 \"color\": ${color},
                 \"fields\": [
                     {\"name\": \"🖥️ Server\", \"value\": \"${hostname}\", \"inline\": true},
                     {\"name\": \"👤 User\", \"value\": \"${user}\", \"inline\": true},
                     {\"name\": \"📅 Time\", \"value\": \"${timestamp}\", \"inline\": true}
                 ],
                 \"footer\": {
                     \"text\": \"Patong Boxing Auto Deploy\",
                     \"icon_url\": \"https://cdn.discordapp.com/emojis/🥊.png\"
                 }
             }]
         }" \
         "$DISCORD_WEBHOOK" > /dev/null 2>&1 || echo "Failed to send Discord notification"
}

# Log function
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        "INFO")
            echo -e "${BLUE}[$timestamp] INFO:${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[$timestamp] WARNING:${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] ERROR:${NC} $message"
            ;;
    esac
}

# Error handler
handle_error() {
    local exit_code=$?
    local line_number=$1
    
    log "ERROR" "Deployment failed at line $line_number with exit code $exit_code"
    send_discord_notification "❌ **Deployment Failed!**\n\nError at line $line_number\nExit code: $exit_code\n\nPlease check server logs for details." "15158332" "DEPLOYMENT FAILED"
    exit $exit_code
}

# Set error trap
trap 'handle_error $LINENO' ERR

# Start deployment
log "INFO" "Starting auto deployment process..."
send_discord_notification "🚀 **Starting Auto Deployment**\n\nBranch: \`${BRANCH}\`\nProject: ${PROJECT_NAME}" "3447003" "DEPLOYMENT STARTED"

# Check if project directory exists
if [ ! -d "$PROJECT_PATH" ]; then
    log "INFO" "Project directory not found. Cloning repository..."
    send_discord_notification "📥 **Cloning Repository**\n\nCloning from GitHub..." "16776960" "CLONING"
    
    # Create directory and clone
    mkdir -p "$(dirname "$PROJECT_PATH")"
    git clone -b "$BRANCH" "$REPO_URL" "$PROJECT_PATH"
    cd "$PROJECT_PATH"
    
    log "SUCCESS" "Repository cloned successfully"
    send_discord_notification "✅ **Repository Cloned**\n\nSuccessfully cloned to server" "65280" "CLONE SUCCESS"
else
    log "INFO" "Project directory exists. Updating code..."
    cd "$PROJECT_PATH"
    
    # Backup current code
    log "INFO" "Creating backup..."
    cp -r .output .output.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    send_discord_notification "📤 **Pulling Latest Code**\n\nUpdating from GitHub..." "16776960" "UPDATING CODE"
    
    # Pull latest changes
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
    git clean -fd
    
    log "SUCCESS" "Code updated successfully"
    send_discord_notification "✅ **Code Updated**\n\nLatest code pulled from GitHub" "65280" "CODE UPDATED"
fi

# Install dependencies
log "INFO" "Installing dependencies..."
send_discord_notification "📦 **Installing Dependencies**\n\nRunning npm ci..." "16776960" "INSTALLING DEPS"

npm ci --production=false

log "SUCCESS" "Dependencies installed successfully"
send_discord_notification "✅ **Dependencies Installed**\n\nAll packages installed successfully" "65280" "DEPS SUCCESS"

# Build application
log "INFO" "Building application..."
send_discord_notification "🔨 **Building Application**\n\nRunning production build..." "16776960" "BUILDING"

npm run build

log "SUCCESS" "Application built successfully"
send_discord_notification "✅ **Build Complete**\n\nApplication built for production" "65280" "BUILD SUCCESS"

# Create logs directory
mkdir -p logs

# PM2 deployment
log "INFO" "Deploying with PM2..."
send_discord_notification "🚀 **Deploying with PM2**\n\nStarting/restarting PM2 process..." "16776960" "PM2 DEPLOY"

# Stop existing process if running
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

# Start or restart the application
pm2 startOrRestart ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

log "SUCCESS" "PM2 deployment completed"

# Health check
log "INFO" "Performing health check..."
send_discord_notification "🏥 **Health Check**\n\nVerifying application status..." "16776960" "HEALTH CHECK"

sleep 5  # Wait for application to start

# Check if process is running
if pm2 show "$PM2_APP_NAME" > /dev/null 2>&1; then
    PROCESS_STATUS=$(pm2 jlist | jq -r ".[] | select(.name==\"$PM2_APP_NAME\") | .pm2_env.status" 2>/dev/null || echo "unknown")
    
    if [ "$PROCESS_STATUS" = "online" ]; then
        log "SUCCESS" "Application is running (Status: $PROCESS_STATUS)"
        
        # Test HTTP endpoint
        if curl -f -s "http://localhost:3000" > /dev/null; then
            log "SUCCESS" "HTTP health check passed"
            send_discord_notification "✅ **Deployment Successful!**\n\n🎉 Application is running smoothly\n📊 Status: Online\n🌐 HTTP: Responding\n🏃‍♂️ PM2: Active\n\n**Ready to serve users!** 🥊" "65280" "DEPLOYMENT SUCCESS"
        else
            log "WARNING" "HTTP health check failed, but PM2 process is running"
            send_discord_notification "⚠️ **Deployment Warning**\n\nPM2 process is running but HTTP check failed\nPlease verify manually" "16776960" "DEPLOYMENT WARNING"
        fi
    else
        log "ERROR" "PM2 process status: $PROCESS_STATUS"
        send_discord_notification "❌ **Deployment Issue**\n\nPM2 process status: $PROCESS_STATUS\nPlease check PM2 logs" "15158332" "DEPLOYMENT ISSUE"
    fi
else
    log "ERROR" "PM2 process not found"
    send_discord_notification "❌ **Deployment Failed**\n\nPM2 process not found after deployment" "15158332" "DEPLOYMENT FAILED"
fi

# Show PM2 status
log "INFO" "PM2 Status:"
pm2 status

# Cleanup old backups (keep last 5)
log "INFO" "Cleaning up old backups..."
find . -maxdepth 1 -name ".output.backup.*" -type d | sort | head -n -5 | xargs rm -rf 2>/dev/null || true

# Final success message
log "SUCCESS" "Auto deployment completed successfully!"
send_discord_notification "🎊 **Auto Deployment Complete!**\n\n✨ **Summary:**\n• Code updated from GitHub\n• Dependencies installed\n• Application built\n• PM2 process restarted\n• Health checks passed\n\n🌐 **Application Status:** Online and Ready!\n\n*Patong Boxing Stadium is live!* 🥊🎪" "65280" "DEPLOYMENT COMPLETE"

echo ""
log "SUCCESS" "🎉 Deployment finished! Your Patong Boxing Stadium frontend is now live!"
echo ""
