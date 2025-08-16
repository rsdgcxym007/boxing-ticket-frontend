#!/bin/bash

# =============================================================================
# Server-side Deploy Script (to run after SSH)
# =============================================================================

set -e

# Configuration
PROJECT_PATH="/var/www/patongboxing-frontend"
PM2_APP_NAME="boxing-ticket-frontend"
REPO_URL="https://github.com/rsdgcxym007/boxing-ticket-frontend.git"
BRANCH="featues/v1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo -e "${GREEN}🥊 Starting Patong Boxing Stadium Deployment...${NC}"
echo ""

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo -e "${RED}This script must be run as root${NC}" 
   exit 1
fi

# Navigate to project directory or create it
if [ ! -d "$PROJECT_PATH" ]; then
    log "INFO" "Project directory not found. Cloning repository..."
    mkdir -p "$(dirname "$PROJECT_PATH")"
    git clone -b "$BRANCH" "$REPO_URL" "$PROJECT_PATH"
    cd "$PROJECT_PATH"
    log "SUCCESS" "Repository cloned successfully"
else
    log "INFO" "Project directory exists. Updating code..."
    cd "$PROJECT_PATH"
    
    # Backup current code
    log "INFO" "Creating backup..."
    cp -r .output .output.backup.$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    
    # Pull latest changes
    git fetch origin "$BRANCH"
    git reset --hard "origin/$BRANCH"
    git clean -fd
    
    log "SUCCESS" "Code updated successfully"
fi

# Install dependencies
log "INFO" "Installing dependencies..."
npm ci --production=false
log "SUCCESS" "Dependencies installed"

# Build application
log "INFO" "Building application..."
npm run build
log "SUCCESS" "Application built"

# Copy production environment
log "INFO" "Setting up environment..."
cp .env.production .env 2>/dev/null || echo "Warning: .env.production not found"

# Create logs directory
mkdir -p logs

# PM2 deployment
log "INFO" "Deploying with PM2..."

# Stop existing process
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

# Start application
pm2 startOrRestart ecosystem.config.cjs --env production

# Save PM2 config
pm2 save

log "SUCCESS" "PM2 deployment completed"

# Health check
log "INFO" "Performing health check..."
sleep 3

if pm2 show "$PM2_APP_NAME" > /dev/null 2>&1; then
    STATUS=$(pm2 jlist | jq -r ".[] | select(.name==\"$PM2_APP_NAME\") | .pm2_env.status" 2>/dev/null || echo "unknown")
    log "SUCCESS" "Application status: $STATUS"
    
    if curl -f -s "http://localhost:3000" > /dev/null; then
        log "SUCCESS" "HTTP health check passed"
    else
        log "WARNING" "HTTP check failed, but PM2 is running"
    fi
else
    log "ERROR" "PM2 process not found"
fi

# Show status
echo ""
log "INFO" "Current PM2 Status:"
pm2 status

# Cleanup old backups
find . -maxdepth 1 -name ".output.backup.*" -type d | sort | head -n -5 | xargs rm -rf 2>/dev/null || true

echo ""
log "SUCCESS" "🎉 Deployment completed successfully!"
log "SUCCESS" "Patong Boxing Stadium is now live! 🥊"
echo ""
