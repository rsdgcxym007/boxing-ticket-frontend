#!/bin/bash

# 🚀 Sync Local Files to VPS
# This script syncs updated files from local to VPS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Configuration
VPS_HOST="43.229.133.51"
VPS_USER="root"
VPS_PATH="/var/www/frontend/boxing-ticket-frontend"
LOCAL_PATH="."

# Files to sync
SYNC_FILES=(
    "deploy.sh"
    "webhook-config.json"
    "start-webhook-server.sh"
    "boxing-webhook.service"
    "watch-logs.sh"
    "ecosystem.config.cjs"
    "generate-lockfile.sh"
    "WEBHOOK_SETUP.md"
    "DEPLOYMENT_LOGGING.md"
    "PORT_REFERENCE.md"
)

# Show help
show_help() {
    echo "🚀 VPS File Sync Tool"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  sync          Sync deployment files to VPS (default)"
    echo "  all           Sync all project files to VPS"
    echo "  check         Check VPS connection"
    echo "  status        Show VPS deployment status"
    echo "  logs          Show VPS deployment logs"
    echo "  test          Test deployment on VPS"
    echo "  help          Show this help"
    echo ""
    echo "Examples:"
    echo "  $0 sync       # Sync deployment files"
    echo "  $0 all        # Sync all files"
    echo "  $0 status     # Check VPS status"
    echo "  $0 test       # Test deployment"
}

# Check VPS connection
check_connection() {
    log_info "Checking VPS connection..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes "$VPS_USER@$VPS_HOST" exit 2>/dev/null; then
        log_success "VPS connection successful"
        return 0
    else
        log_error "Cannot connect to VPS: $VPS_HOST"
        log_info "Make sure SSH key is set up or provide password"
        return 1
    fi
}

# Sync specific files
sync_files() {
    log_info "🔄 Syncing deployment files to VPS..."
    
    if ! check_connection; then
        exit 1
    fi
    
    # Create backup on VPS
    log_info "Creating backup on VPS..."
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && cp deploy.sh deploy.sh.backup-$(date +%Y%m%d_%H%M%S) 2>/dev/null || true"
    
    # Sync each file
    for file in "${SYNC_FILES[@]}"; do
        if [ -f "$file" ]; then
            log_info "Syncing: $file"
            if scp "$file" "$VPS_USER@$VPS_HOST:$VPS_PATH/"; then
                log_success "✓ $file synced"
            else
                log_error "✗ Failed to sync $file"
            fi
        else
            log_warning "⚠ File not found: $file"
        fi
    done
    
    # Set permissions
    log_info "Setting permissions on VPS..."
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && chmod +x *.sh 2>/dev/null || true"
    
    log_success "🎉 File sync completed!"
}

# Sync all files
sync_all() {
    log_info "🔄 Syncing ALL files to VPS..."
    
    if ! check_connection; then
        exit 1
    fi
    
    # Create backup
    log_info "Creating full backup on VPS..."
    ssh "$VPS_USER@$VPS_HOST" "cd /var/www/frontend && tar -czf boxing-ticket-frontend-backup-$(date +%Y%m%d_%H%M%S).tar.gz boxing-ticket-frontend/ 2>/dev/null || true"
    
    # Exclude node_modules and build artifacts
    log_info "Syncing project files (excluding node_modules, .git, etc.)..."
    rsync -avz --progress \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude '.nuxt' \
        --exclude '.output' \
        --exclude 'dist' \
        --exclude '*.log' \
        "$LOCAL_PATH/" "$VPS_USER@$VPS_HOST:$VPS_PATH/"
    
    # Set permissions
    log_info "Setting permissions on VPS..."
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && chmod +x *.sh 2>/dev/null || true"
    
    log_success "🎉 Full sync completed!"
}

# Show VPS status
show_status() {
    log_info "📊 VPS Deployment Status..."
    
    if ! check_connection; then
        exit 1
    fi
    
    log_info "PM2 Status:"
    ssh "$VPS_USER@$VPS_HOST" "pm2 list" || log_warning "PM2 not running or no processes"
    
    log_info "Webhook Server Status:"
    ssh "$VPS_USER@$VPS_HOST" "systemctl status boxing-webhook --no-pager -l" || log_warning "Webhook service not running"
    
    log_info "Port Status:"
    ssh "$VPS_USER@$VPS_HOST" "netstat -tulpn | grep -E ':(3000|4000|4200)'" || log_warning "Ports not listening"
    
    log_info "Health Check:"
    ssh "$VPS_USER@$VPS_HOST" "curl -s http://localhost:3000/health || echo 'Health check failed'"
}

# Show VPS logs
show_logs() {
    log_info "📋 VPS Deployment Logs..."
    
    if ! check_connection; then
        exit 1
    fi
    
    log_info "Recent deployment logs:"
    ssh "$VPS_USER@$VPS_HOST" "tail -50 /var/log/frontend/deployment.log 2>/dev/null || echo 'No deployment logs found'"
    
    log_info "PM2 logs:"
    ssh "$VPS_USER@$VPS_HOST" "pm2 logs boxing-ticket-frontend --lines 20 --nostream 2>/dev/null || echo 'No PM2 logs'"
}

# Test deployment on VPS
test_deployment() {
    log_info "🧪 Testing deployment on VPS..."
    
    if ! check_connection; then
        exit 1
    fi
    
    # Run syntax check
    log_info "Checking deploy.sh syntax..."
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && bash -n deploy.sh" || {
        log_error "deploy.sh has syntax errors"
        return 1
    }
    log_success "deploy.sh syntax is valid"
    
    # Test webhook config
    log_info "Checking webhook config..."
    ssh "$VPS_USER@$VPS_HOST" "cd $VPS_PATH && cat webhook-config.json | jq . >/dev/null" || {
        log_warning "webhook-config.json might have JSON errors"
    }
    log_success "webhook-config.json is valid"
    
    # Test webhook endpoint
    log_info "Testing webhook endpoint..."
    ssh "$VPS_USER@$VPS_HOST" "curl -s http://localhost:4200/hooks/deploy-frontend -X POST -H 'Content-Type: application/json' -d '{\"test\":true}' || echo 'Webhook test failed'"
    
    log_success "🎉 VPS deployment test completed!"
}

# Main
case "${1:-sync}" in
    sync)
        sync_files
        ;;
    all)
        sync_all
        ;;
    check)
        check_connection && log_success "VPS connection is working"
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    test)
        test_deployment
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown option: $1"
        show_help
        exit 1
        ;;
esac
