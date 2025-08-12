#!/bin/bash

# 🚀 Boxing Ticket Frontend - Complete VPS Deployment Script
# Includes setup, deployment, webhook testing, and dependency management

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
    echo -e "${RED}❌        if curl -s http://localhost:4200/health > /dev/null; then$1${NC}"
}

# Alias for compatibility
log_warn() {
    log_warning "$1"
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

# Clean up PM2 duplicates
cleanup_pm2_duplicates() {
    log_info "🧹 Cleaning up PM2 duplicate processes..."
    
    # Only target our specific application, not all PM2 processes
    log_info "Stopping only boxing-ticket-frontend processes..."
    
    # Stop and delete only our app instances (by name)
    pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    
    # Delete any ecosystem config processes (both .cjs and .mjs) - but be specific
    pm2 delete ecosystem.config.cjs 2>/dev/null || true
    pm2 delete ecosystem.config.mjs 2>/dev/null || true
    
    # Get list of all processes and remove only our specific boxing-ticket-frontend ones
    local pm2_processes=$(pm2 jlist 2>/dev/null || echo "[]")
    
    if [ "$pm2_processes" != "[]" ]; then
        echo "$pm2_processes" | jq -r '.[] | select(.name | test("^boxing-ticket-frontend$")) | .pm_id' 2>/dev/null | while read -r process_id; do
            if [ -n "$process_id" ] && [ "$process_id" != "null" ]; then
                log_warning "Removing duplicate boxing-ticket-frontend process ID: $process_id"
                pm2 delete "$process_id" 2>/dev/null || true
            fi
        done
    fi
    
    # Wait for processes to fully stop
    sleep 2
    
    log_success "PM2 cleanup completed (only boxing-ticket-frontend processes affected)"
}

# VPS Setup Function
setup_vps() {
    log_info "🚀 Setting up VPS environment..."
    
    # Create directories
    sudo mkdir -p "/var/www/frontend" "/var/backups/frontend" "/var/log/frontend"
    
    # Set permissions
    sudo chown -R "$USER:$USER" "/var/www/frontend" "/var/backups/frontend" "/var/log/frontend"
    chmod -R 755 "/var/www/frontend" "/var/backups/frontend" "/var/log/frontend"
    
    # Create environment file if not exists
    if [ ! -f "$APP_DIR/.env.production" ]; then
        cat > "$APP_DIR/.env.production" << EOF
NODE_ENV=production
NUXT_APP_BASE_URL=http://43.229.133.51:3000
NUXT_PUBLIC_API_BASE=http://43.229.133.51:8000/api
NUXT_PUBLIC_STORAGE_URL=http://43.229.133.51:8000/storage
EOF
        log_success "Environment file created"
    fi
    
    # Create PM2 ecosystem file
    if [ ! -f "$APP_DIR/ecosystem.config.cjs" ]; then
        cat > "$APP_DIR/ecosystem.config.cjs" << 'EOF'
module.exports = {
  apps: [{
    name: 'boxing-ticket-frontend',
    port: '3000',
    exec_mode: 'cluster',
    instances: 'max',
    script: './.output/server/index.mjs',
    cwd: '/var/www/frontend/boxing-ticket-frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NITRO_HOST: '0.0.0.0',
      NITRO_PORT: 3000
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/log/frontend/error.log',
    out_file: '/var/log/frontend/out.log',
    log_file: '/var/log/frontend/combined.log',
    autorestart: true,
    max_memory_restart: '1G'
  }]
}
EOF
        log_success "PM2 ecosystem file created"
    fi
    
    # Create health check script
    cat > "/var/log/frontend/health-check.sh" << 'EOF'
#!/bin/bash
HEALTH_URL="http://localhost:4200/health"
if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is not responding"
    exit 1
fi
EOF
    chmod +x "/var/log/frontend/health-check.sh"
    
    # Create systemd service for webhook
    sudo tee /etc/systemd/system/boxing-webhook.service > /dev/null << EOF
[Unit]
Description=Boxing Ticket Frontend Webhook Handler
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/bin/bash $APP_DIR/webhook-handler.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable boxing-webhook.service
    
    log_success "VPS setup completed!"
}

# Install missing dependencies
install_dependencies_fix() {
    log_info "📦 Installing missing dependencies..."
    
    cd "$APP_DIR"
    
    # Install qr-scanner if missing
    if ! npm list qr-scanner >/dev/null 2>&1; then
        npm install qr-scanner@1.4.2
        log_success "qr-scanner installed"
    fi
    
    # Clear cache and reinstall
    npm cache clean --force
    npm ci --production=false
    
    log_success "Dependencies fixed!"
}

# Cleanup conflicting mobile components
cleanup_mobile_conflicts() {
    log_info "Cleaning up conflicting mobile components..."
    
    cd "$APP_DIR"
    
    # Remove lowercase mobile folder if it exists
    if [ -d "components/mobile" ]; then
        log_warning "Removing conflicting lowercase mobile folder..."
        rm -rf "components/mobile"
        log_success "Removed components/mobile/"
    else
        log_info "No conflicting mobile folder found"
    fi
    
    # Ensure uppercase Mobile folder exists
    if [ ! -d "components/Mobile" ]; then
        mkdir -p "components/Mobile"
        log_success "Created components/Mobile/"
    fi
    
    log_success "Mobile component conflicts cleaned up"
}

# Create missing mobile components
create_missing_components() {
    log_info "🔧 Creating missing mobile components..."
    
    cd "$APP_DIR"
    
    # Create Mobile components directory (with correct capitalization)
    mkdir -p "components/Mobile"
    
    # Check and create ScanHistoryModal.vue if missing
    if [ ! -f "components/Mobile/ScanHistoryModal.vue" ]; then
        log_info "Creating ScanHistoryModal.vue..."
        cat > "components/Mobile/ScanHistoryModal.vue" << 'EOF'
<template>
  <div 
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:history" class="text-2xl" />
            <h3 class="text-lg font-semibold">ประวัติการสแกน</h3>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Empty State -->
        <div class="text-center py-12">
          <Icon icon="mdi:history" class="text-6xl text-gray-300 mx-auto mb-4" />
          <h4 class="text-lg font-medium text-gray-900 mb-2">ยังไม่มีประวัติการสแกน</h4>
          <p class="text-gray-500">เริ่มสแกน QR Code เพื่อดูประวัติ</p>
        </div>

        <!-- Footer Actions -->
        <div class="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
          <button
            @click="$emit('close')"
            class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
defineEmits(['close']);
</script>
EOF
        log_success "ScanHistoryModal.vue created"
    fi
    
    # Check and create ErrorModal.vue if missing
    if [ ! -f "components/Mobile/ErrorModal.vue" ]; then
        log_info "Creating ErrorModal.vue..."
        cat > "components/Mobile/ErrorModal.vue" << 'EOF'
<template>
  <div 
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl max-w-md w-full overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:alert-circle" class="text-2xl" />
            <h3 class="text-lg font-semibold">เกิดข้อผิดพลาด</h3>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Error Icon -->
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:alert-circle" class="text-3xl text-red-600" />
          </div>
          <h4 class="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h4>
        </div>

        <!-- Error Message -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-800 text-center">
            {{ error || 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ' }}
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex space-x-3">
          <button
            @click="$emit('retry')"
            class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Icon icon="mdi:refresh" class="text-lg" />
            <span>ลองใหม่</span>
          </button>
          <button
            @click="$emit('close')"
            class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
const props = defineProps({
  error: {
    type: String,
    default: ''
  }
});
defineEmits(['close', 'retry']);
</script>
EOF
        log_success "ErrorModal.vue created"
    fi
    
    # Check and create ScanResultModal.vue if missing
    if [ ! -f "components/Mobile/ScanResultModal.vue" ]; then
        log_info "Creating ScanResultModal.vue..."
        cat > "components/Mobile/ScanResultModal.vue" << 'EOF'
<template>
  <div 
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <Icon icon="mdi:qrcode-scan" class="text-2xl" />
            <h3 class="text-lg font-semibold">ผลการสแกน</h3>
          </div>
          <button 
            @click="$emit('close')"
            class="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="text-center py-8">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="mdi:check-circle" class="text-3xl text-green-600" />
          </div>
          <h4 class="text-xl font-semibold text-gray-900 mb-2">สแกนสำเร็จ!</h4>
          <div class="flex space-x-3 mt-6">
            <button
              @click="$emit('scan-next')"
              class="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              สแกนต่อ
            </button>
            <button
              @click="$emit('close')"
              class="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
const props = defineProps({
  result: {
    type: Object,
    default: () => ({})
  }
});
defineEmits(['close', 'scan-next']);
</script>
EOF
        log_success "ScanResultModal.vue created"
    fi
    
    log_success "Missing components created!"
}

# Test webhook system
test_webhook() {
    log_info "🧪 Testing webhook system..."
    
    local webhook_url="http://43.229.133.51:4300/hooks/deploy-frontend"
    
    # Test Discord notification
    send_discord_notification "🧪 TESTING" "Webhook test started" "16776960"
    
    # Test webhook endpoint
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"ref":"refs/heads/featues/v1","repository":{"name":"boxing-ticket-frontend"}}' \
        -w "%{http_code}" \
        "$webhook_url" 2>/dev/null)
    
    local http_code="${response: -3}"
    local response_body="${response%???}"
    
    if [ "$http_code" = "200" ]; then
        log_success "Webhook test successful!"
        send_discord_notification "✅ TEST SUCCESS" "Webhook system working correctly" "3066993"
    else
        log_error "Webhook test failed with HTTP $http_code"
        send_discord_notification "❌ TEST FAILED" "HTTP Code: $http_code" "15158332"
    fi
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
    
    # Install dependencies immediately after code pull
    log_info "Installing dependencies after code pull..."
    npm ci --production=false || {
        log_warning "npm ci failed after pull, will retry in install_dependencies step"
    }
    
    echo "$commit_hash" > .deployment-info
    echo "$(date)" >> .deployment-info
}

# Install dependencies
install_dependencies() {
    log_info "Installing dependencies (comprehensive check)..."
    
    cd "$APP_DIR"
    
    # Clear npm cache for clean install
    log_info "Clearing npm cache..."
    npm cache clean --force
    
    # Remove node_modules for clean slate
    if [ -d "node_modules" ]; then
        log_info "Removing existing node_modules..."
        rm -rf node_modules
    fi
    
    # Remove package-lock.json if it exists to avoid conflicts
    if [ -f "package-lock.json" ]; then
        log_info "Removing existing package-lock.json..."
        rm -f package-lock.json
    fi
    
    # Fresh install with production dependencies
    log_info "Running fresh npm ci..."
    npm ci --production=false --verbose
    
    # Verify critical packages are installed
    log_info "Verifying critical packages..."
    npm list qr-scanner > /dev/null 2>&1 || {
        log_warning "qr-scanner missing, installing..."
        npm install qr-scanner@1.4.2
    }
    
    log_success "Dependencies installed and verified"
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
    
    # One more dependency check before build
    log_info "Final dependency check before build..."
    npm ci --production=false --quiet || {
        log_warning "Final npm ci failed, but continuing with build..."
    }
    
    # Build the application
    log_info "Running npm run build..."
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
        if curl -s http://localhost:4200/health > /dev/null 2>&1; then
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
    
    # Run pre-deployment cleanup script
    log_info "Running pre-deployment cleanup..."
    if [ -f "./pre-deploy-cleanup.sh" ]; then
        chmod +x ./pre-deploy-cleanup.sh
        ./pre-deploy-cleanup.sh
        if [ $? -ne 0 ]; then
            log_error "Pre-deployment cleanup failed"
            return 1
        fi
    else
        log_warning "Pre-deployment cleanup script not found, performing basic cleanup..."
        
        # Fallback basic cleanup
        pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
        pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
        pm2 delete ecosystem.config.cjs 2>/dev/null || true
        pm2 delete ecosystem.config.mjs 2>/dev/null || true
    fi
    
    # Wait for processes to fully stop
    sleep 3
    
    log_info "Starting new PM2 application..."
    # Start only with ecosystem config
    if pm2 start ecosystem.config.cjs --env production; then
        log_success "PM2 started successfully with ecosystem config"
    else
        log_error "Failed to start PM2 with ecosystem config"
        return 1
    fi
    
    # Save PM2 configuration only once
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
    cleanup_pm2_duplicates  # Clean up any duplicate PM2 processes first
    backup_current
    pull_code
    cleanup_mobile_conflicts
    create_missing_components
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
        
        log_info "Application URL: http://43.229.133.51:4200"
        log_info "Health Check: http://43.229.133.51:4200/health"
        
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
    echo "Boxing Ticket Frontend - Complete VPS Deployment Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  deploy          Start deployment process (default)"
    echo "  setup           Setup VPS environment (first time)"
    echo "  deps            Install/fix dependencies"
    echo "  components      Create missing components"
    echo "  cleanup         Remove conflicting mobile components"
    echo "  test            Test webhook system"
    echo "  status          Show application status"
    echo "  logs            Show application logs"
    echo "  restart         Restart application"
    echo "  stop            Stop application"
    echo "  health          Check application health"
    echo "  backup          Create manual backup"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup        # First time VPS setup"
    echo "  $0 deploy       # Deploy application"
    echo "  $0 components   # Create missing components"
    echo "  $0 cleanup      # Remove conflicting files"
    echo "  $0 deps         # Fix dependencies"
    echo "  $0 test         # Test webhook"
    echo "  $0 status       # Show PM2 status"
    echo "  $0 logs         # Show application logs"
}

# Handle different commands
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    setup)
        setup_vps
        ;;
    deps)
        install_dependencies_fix
        ;;
    components)
        create_missing_components
        ;;
    cleanup)
        cleanup_mobile_conflicts
        ;;
    test)
        test_webhook
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
