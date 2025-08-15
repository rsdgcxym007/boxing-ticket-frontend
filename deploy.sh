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
PROJECT_NAME="Patong Boxing Stadium Ticket"
APP_DIR="/var/www/patongboxing"
PM2_APP_NAME="boxing-ticket-frontend"
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
BRANCH="featues/v1"
NODE_VERSION="18"
USER=$(whoami)
DOMAIN="patongboxingstadiumticket.com"
FRONTEND_PORT="3000"
BACKEND_PORT="4000"

# Parse webhook arguments if provided
WEBHOOK_REF="$1"
WEBHOOK_REPO="$2"

# Extract branch from webhook ref if provided
if [ -n "$WEBHOOK_REF" ]; then
    WEBHOOK_BRANCH=$(echo "$WEBHOOK_REF" | sed 's/refs\/heads\///')
    if [ -n "$WEBHOOK_BRANCH" ]; then
        BRANCH="$WEBHOOK_BRANCH"
        log_info "Using branch from webhook: $BRANCH"
    fi
fi

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1" >> /var/log/frontend/deployment.log 2>/dev/null || true
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] SUCCESS: $1" >> /var/log/frontend/deployment.log 2>/dev/null || true
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WARNING: $1" >> /var/log/frontend/deployment.log 2>/dev/null || true
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >> /var/log/frontend/deployment.log 2>/dev/null || true
}

# Enhanced logging for step tracking
log_step_start() {
    local step="$1"
    echo -e "\n${BLUE}🚀 STEP: $step${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] STEP_START: $step" >> /var/log/frontend/deployment.log 2>/dev/null || true
}

log_step_end() {
    local step="$1"
    local status="${2:-SUCCESS}"
    if [ "$status" = "SUCCESS" ]; then
        echo -e "${GREEN}✅ COMPLETED: $step${NC}"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] STEP_END: $step - SUCCESS" >> /var/log/frontend/deployment.log 2>/dev/null || true
    else
        echo -e "${RED}❌ FAILED: $step${NC}"
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] STEP_END: $step - FAILED: $status" >> /var/log/frontend/deployment.log 2>/dev/null || true
    fi
}

log_command() {
    local cmd="$1"
    echo -e "${BLUE}🔧 COMMAND: $cmd${NC}"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] COMMAND: $cmd" >> /var/log/frontend/deployment.log 2>/dev/null || true
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
NUXT_PUBLIC_API_BASE=http://43.229.133.51:4000/api
NUXT_PUBLIC_STORAGE_URL=http://43.229.133.51:4000/storage
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
HEALTH_URL="http://localhost:3000/health"
if curl -s "$HEALTH_URL" > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    exit 0
else
    echo "❌ Application is not responding"
    exit 1
fi
EOF
    chmod +x "/var/log/frontend/health-check.sh"
    
    log_success "VPS setup completed!"
}

# Setup webhook server
setup_webhook_server() {
    log_info "🎣 Setting up external webhook server..."
    
    # Check if webhook binary exists
    if ! command -v webhook &> /dev/null; then
        log_warning "Installing webhook binary..."
        # Try to download and install webhook
        cd /tmp
        wget -q "https://github.com/adnanh/webhook/releases/download/2.8.0/webhook-linux-amd64.tar.gz"
        tar -xzf webhook-linux-amd64.tar.gz
        sudo mv webhook-linux-amd64/webhook /usr/local/bin/
        rm -rf webhook-linux-amd64*
        log_success "Webhook binary installed"
    fi
    
    # Copy systemd service
    sudo cp "$APP_DIR/boxing-webhook.service" /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable boxing-webhook.service
    
    log_success "Webhook server setup completed!"
    log_info "To start webhook server: sudo systemctl start boxing-webhook"
    log_info "Webhook URL: http://43.229.133.51:4200/hooks/deploy-frontend"
}

# Generate lockfile if missing
generate_lockfile() {
    log_info "🔒 Checking package-lock.json..."
    
    cd "$APP_DIR"
    
    if [ ! -f "package-lock.json" ]; then
        log_warning "package-lock.json missing, generating..."
        
        # Run the lockfile generation script
        if [ -f "./generate-lockfile.sh" ]; then
            chmod +x ./generate-lockfile.sh
            ./generate-lockfile.sh
        else
            # Fallback: generate manually
            log_info "Generating package-lock.json manually..."
            npm cache clean --force
            npm install --package-lock-only
        fi
        
        log_success "package-lock.json generated"
    else
        log_info "package-lock.json exists"
    fi
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
    
    local webhook_url="http://43.229.133.51:4200/hooks/deploy-frontend"
    
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
    log_step_start "Checking prerequisites"
    
    # Check if Node.js is installed
    log_info "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        log_step_end "Checking prerequisites" "Node.js not installed"
        exit 1
    fi
    log_success "Node.js found: $(node -v)"
    
    # Check Node.js version
    log_info "Validating Node.js version..."
    NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt "$NODE_VERSION" ]; then
        log_step_end "Checking prerequisites" "Node.js version $NODE_VERSION+ required, found $(node -v)"
        exit 1
    fi
    log_success "Node.js version $(node -v) meets requirements"
    
    # Check if npm is installed
    log_info "Checking npm installation..."
    if ! command -v npm &> /dev/null; then
        log_step_end "Checking prerequisites" "npm not installed"
        exit 1
    fi
    log_success "npm found: $(npm -v)"
    
    # Check if PM2 is installed
    log_info "Checking PM2 installation..."
    if ! command -v pm2 &> /dev/null; then
        log_step_end "Checking prerequisites" "PM2 not installed"
        exit 1
    fi
    log_success "PM2 found: $(pm2 -v)"
    
    # Check if git is installed
    log_info "Checking git installation..."
    if ! command -v git &> /dev/null; then
        log_step_end "Checking prerequisites" "Git not installed"
        exit 1
    fi
    log_success "Git found: $(git --version)"
    
    log_step_end "Checking prerequisites"
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
    log_step_start "Pulling latest code from repository"
    
    log_info "Changing to app directory: $APP_DIR"
    cd "$APP_DIR" || {
        log_step_end "Pulling latest code from repository" "Failed to change directory"
        exit 1
    }
    
    # Stash any local changes
    log_info "Stashing local changes..."
    log_command "git stash push -m 'Auto-stash before deployment $(date)'"
    git stash push -m "Auto-stash before deployment $(date)" || {
        log_warning "Failed to stash changes (might be clean)"
    }
    
    # Fetch latest changes
    log_info "Fetching latest changes..."
    log_command "git fetch origin"
    if ! git fetch origin; then
        log_step_end "Pulling latest code from repository" "Git fetch failed"
        exit 1
    fi
    log_success "Git fetch completed"
    
    # Checkout target branch
    log_info "Checking out branch: $BRANCH"
    log_command "git checkout $BRANCH"
    if ! git checkout "$BRANCH"; then
        log_step_end "Pulling latest code from repository" "Failed to checkout branch $BRANCH"
        exit 1
    fi
    log_success "Checked out branch: $BRANCH"
    
    # Pull latest code
    log_info "Pulling latest code..."
    log_command "git pull origin $BRANCH"
    if ! git pull origin "$BRANCH"; then
        log_step_end "Pulling latest code from repository" "Git pull failed"
        exit 1
    fi
    
    local commit_hash=$(git rev-parse --short HEAD)
    local commit_message=$(git log -1 --pretty=%B)
    
    log_success "Code updated to commit: $commit_hash"
    log_info "Commit message: $commit_message"
    
    # Install dependencies immediately after code pull
    log_info "Installing dependencies after code pull..."
    if [ -f "package-lock.json" ]; then
        log_command "npm ci --production=false"
        if npm ci --production=false; then
            log_success "npm ci completed successfully"
        else
            log_warning "npm ci failed, trying npm install..."
            log_command "npm install --production=false"
            if npm install --production=false; then
                log_success "npm install completed successfully"
            else
                log_warning "npm install failed, continuing anyway..."
            fi
        fi
    else
        log_info "No package-lock.json found, using npm install..."
        log_command "npm install --production=false"
        if npm install --production=false; then
            log_success "npm install completed successfully"
        else
            log_warning "npm install failed, continuing anyway..."
        fi
    fi
    
    # Save deployment info
    echo "$commit_hash" > .deployment-info
    echo "$(date)" >> .deployment-info
    log_info "Deployment info saved"
    
    log_step_end "Pulling latest code from repository"
}

# Install dependencies
install_dependencies() {
    log_step_start "Installing dependencies (comprehensive check)"
    
    cd "$APP_DIR" || {
        log_step_end "Installing dependencies" "Failed to change directory"
        exit 1
    }
    
    # Clear npm cache for clean install
    log_info "Clearing npm cache..."
    log_command "npm cache clean --force"
    if npm cache clean --force; then
        log_success "npm cache cleared"
    else
        log_warning "Failed to clear npm cache, continuing..."
    fi
    
    # Remove node_modules for clean slate
    if [ -d "node_modules" ]; then
        log_info "Removing existing node_modules..."
        log_command "rm -rf node_modules"
        rm -rf node_modules
        log_success "node_modules removed"
    else
        log_info "No existing node_modules found"
    fi
    
    # Check package-lock.json status
    if [ -f "package-lock.json" ]; then
        log_info "Found existing package-lock.json, validating..."
        log_success "package-lock.json exists"
    else
        log_info "No package-lock.json found, will generate new one..."
    fi
    
    # Fresh install with production dependencies
    log_info "Running dependency installation..."
    if [ -f "package-lock.json" ]; then
        log_command "npm ci --production=false --verbose"
        if npm ci --production=false --verbose; then
            log_success "npm ci completed successfully"
        else
            log_warning "npm ci failed, falling back to npm install..."
            log_command "rm -f package-lock.json"
            rm -f package-lock.json
            log_command "npm install --production=false --verbose"
            if npm install --production=false --verbose; then
                log_success "npm install completed successfully"
            else
                log_step_end "Installing dependencies" "npm install failed"
                exit 1
            fi
        fi
    else
        log_command "npm install --production=false --verbose"
        if npm install --production=false --verbose; then
            log_success "npm install completed successfully"
        else
            log_step_end "Installing dependencies" "npm install failed"
            exit 1
        fi
    fi
    
    # Verify critical packages are installed
    log_info "Verifying critical packages..."
    log_command "npm list qr-scanner"
    if npm list qr-scanner > /dev/null 2>&1; then
        log_success "qr-scanner package verified"
    else
        log_warning "qr-scanner missing, installing..."
        log_command "npm install qr-scanner@1.4.2"
        if npm install qr-scanner@1.4.2; then
            log_success "qr-scanner installed successfully"
        else
            log_warning "Failed to install qr-scanner, continuing..."
        fi
    fi
    
    log_step_end "Installing dependencies"
}

# Build application
build_application() {
    log_step_start "Building application"
    
    cd "$APP_DIR" || {
        log_step_end "Building application" "Failed to change directory"
        exit 1
    }
    
    # Copy production environment
    if [ -f ".env.production" ]; then
        log_info "Copying production environment configuration..."
        log_command "cp .env.production .env"
        cp .env.production .env
        log_success "Production environment configuration applied"
    else
        log_warning "No .env.production file found"
    fi
    
    # One more dependency check before build
    log_info "Final dependency check before build..."
    if [ -f "package-lock.json" ]; then
        log_command "npm ci --production=false --quiet"
        if npm ci --production=false --quiet; then
            log_success "Final dependency check completed with npm ci"
        else
            log_warning "Final npm ci failed, trying npm install..."
            log_command "npm install --production=false --quiet"
            if npm install --production=false --quiet; then
                log_success "Final dependency check completed with npm install"
            else
                log_warning "Final dependency check failed, continuing with build..."
            fi
        fi
    else
        log_command "npm install --production=false --quiet"
        if npm install --production=false --quiet; then
            log_success "Final dependency check completed with npm install"
        else
            log_warning "Final dependency check failed, continuing with build..."
        fi
    fi
    
    # Build the application
    log_info "Running npm run build..."
    log_command "npm run build"
    if npm run build; then
        log_success "Build completed successfully"
    else
        log_step_end "Building application" "Build failed"
        exit 1
    fi
    
    # Verify build output
    if [ -d ".output" ]; then
        log_success "Build output directory (.output) verified"
    else
        log_step_end "Building application" "Build output directory not found"
        exit 1
    fi
    
    log_step_end "Building application"
}

# Health check
health_check() {
    log_step_start "Performing health check"
    
    # Wait for application to start
    log_info "Waiting for application to start (10 seconds)..."
    sleep 10
    log_success "Initial wait completed"
    
    # Check if application is responding
    local max_attempts=30
    local attempt=0
    local health_url="http://localhost:3000/health"
    
    log_info "Starting health check attempts (max: $max_attempts)"
    
    while [ $attempt -lt $max_attempts ]; do
        attempt=$((attempt + 1))
        log_info "Health check attempt $attempt/$max_attempts..."
        log_command "curl -s $health_url"
        
        if curl -s "$health_url" > /dev/null 2>&1; then
            log_success "Health check passed on attempt $attempt"
            
            # Get actual health response
            local health_response=$(curl -s "$health_url" 2>/dev/null || echo "No response")
            log_info "Health response: $health_response"
            
            log_step_end "Performing health check"
            return 0
        fi
        
        log_warning "Health check attempt $attempt failed, retrying in 2 seconds..."
        sleep 2
    done
    
    log_step_end "Performing health check" "Failed after $max_attempts attempts"
    
    # Additional debugging
    log_error "Health check debugging info:"
    log_command "pm2 list"
    pm2 list | grep "$PM2_APP_NAME" || log_warning "App not found in PM2"
    log_command "netstat -tulpn | grep :3000"
    netstat -tulpn | grep :3000 || log_warning "Port 3000 not listening"
    
    return 1
}

# Start/Restart PM2 application
manage_pm2() {
    log_step_start "Managing PM2 application"
    
    cd "$APP_DIR" || {
        log_step_end "Managing PM2 application" "Failed to change directory"
        exit 1
    }
    
    # Run pre-deployment cleanup script
    log_info "Running pre-deployment cleanup..."
    if [ -f "./pre-deploy-cleanup.sh" ]; then
        log_command "chmod +x ./pre-deploy-cleanup.sh"
        chmod +x ./pre-deploy-cleanup.sh
        log_command "./pre-deploy-cleanup.sh"
        if ./pre-deploy-cleanup.sh; then
            log_success "Pre-deployment cleanup completed"
        else
            log_step_end "Managing PM2 application" "Pre-deployment cleanup failed"
            return 1
        fi
    else
        log_warning "Pre-deployment cleanup script not found, performing basic cleanup..."
        
        # Fallback basic cleanup
        log_command "pm2 stop $PM2_APP_NAME"
        pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
        log_command "pm2 delete $PM2_APP_NAME"
        pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
        log_command "pm2 delete ecosystem.config.cjs"
        pm2 delete ecosystem.config.cjs 2>/dev/null || true
        log_command "pm2 delete ecosystem.config.mjs"
        pm2 delete ecosystem.config.mjs 2>/dev/null || true
        log_success "Basic cleanup completed"
    fi
    
    # Wait for processes to fully stop
    log_info "Waiting for processes to stop..."
    sleep 3
    log_success "Process stop wait completed"
    
    # Verify ecosystem config exists
    if [ ! -f "ecosystem.config.cjs" ]; then
        log_step_end "Managing PM2 application" "ecosystem.config.cjs not found"
        return 1
    fi
    log_success "ecosystem.config.cjs verified"
    
    log_info "Starting new PM2 application..."
    log_command "pm2 start ecosystem.config.cjs --env production"
    if pm2 start ecosystem.config.cjs --env production; then
        log_success "PM2 started successfully with ecosystem config"
    else
        log_step_end "Managing PM2 application" "Failed to start PM2"
        return 1
    fi
    
    # Save PM2 configuration
    log_info "Saving PM2 configuration..."
    log_command "pm2 save"
    if pm2 save; then
        log_success "PM2 configuration saved"
    else
        log_warning "Failed to save PM2 configuration"
    fi
    
    # Show PM2 status
    log_info "Current PM2 status:"
    pm2 list | grep "$PM2_APP_NAME" || log_warning "Application not found in PM2 list"
    
    log_step_end "Managing PM2 application"
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
    local deployment_id="DEPLOY_$(date +%Y%m%d_%H%M%S)"
    
    echo "============================================" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
    echo "🚀 DEPLOYMENT STARTED: $deployment_id" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
    echo "============================================" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
    
    log_info "🚀 Starting deployment of $PROJECT_NAME..."
    log_info "Deployment ID: $deployment_id"
    log_info "Branch: $BRANCH"
    log_info "Timestamp: $(date)"
    
    send_discord_notification "🚀 STARTING" "Deployment started on $(hostname) - ID: $deployment_id" "16776960"
    
    # Set up error handling
    trap 'deploy_failed' ERR
    
    # Create log directories
    sudo mkdir -p /var/log/frontend 2>/dev/null || true
    sudo chown -R "$USER:$USER" /var/log/frontend 2>/dev/null || true
    
    log_info "📋 DEPLOYMENT PLAN:"
    log_info "1. Check permissions"
    log_info "2. Check prerequisites" 
    log_info "3. Cleanup PM2 duplicates"
    log_info "4. Backup current deployment"
    log_info "5. Pull latest code"
    log_info "6. Generate lockfile"
    log_info "7. Cleanup mobile conflicts"
    log_info "8. Create missing components"
    log_info "9. Install dependencies"
    log_info "10. Cleanup old files"
    log_info "11. Build application"
    log_info "12. Manage PM2"
    log_info "13. Health check"
    
    # Run deployment steps with individual error handling
    check_permissions || { log_step_end "DEPLOYMENT" "check_permissions failed"; exit 1; }
    check_prerequisites || { log_step_end "DEPLOYMENT" "check_prerequisites failed"; exit 1; }
    cleanup_pm2_duplicates || { log_step_end "DEPLOYMENT" "cleanup_pm2_duplicates failed"; exit 1; }
    backup_current || { log_step_end "DEPLOYMENT" "backup_current failed"; exit 1; }
    pull_code || { log_step_end "DEPLOYMENT" "pull_code failed"; exit 1; }
    generate_lockfile || { log_step_end "DEPLOYMENT" "generate_lockfile failed"; exit 1; }
    cleanup_mobile_conflicts || { log_step_end "DEPLOYMENT" "cleanup_mobile_conflicts failed"; exit 1; }
    create_missing_components || { log_step_end "DEPLOYMENT" "create_missing_components failed"; exit 1; }
    install_dependencies || { log_step_end "DEPLOYMENT" "install_dependencies failed"; exit 1; }
    cleanup || { log_step_end "DEPLOYMENT" "cleanup failed"; exit 1; }
    build_application || { log_step_end "DEPLOYMENT" "build_application failed"; exit 1; }
    manage_pm2 || { log_step_end "DEPLOYMENT" "manage_pm2 failed"; exit 1; }
    
    # Wait and perform health check
    if health_check; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        
        echo "============================================" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
        echo "✅ DEPLOYMENT SUCCESS: $deployment_id" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
        echo "============================================" | tee -a /var/log/frontend/deployment.log 2>/dev/null || true
        
        log_success "🎉 Deployment completed successfully in ${duration}s!"
        log_success "Deployment ID: $deployment_id"
        send_discord_notification "✅ SUCCESS" "Deployment $deployment_id completed successfully in ${duration}s" "65280"
        
        # Show application info
        log_info "📊 APPLICATION STATUS:"
        pm2 describe "$PM2_APP_NAME" | grep -E "(status|uptime|memory|cpu)"
        
        log_info "Application URL: http://43.229.133.51:3000"
        log_info "Health Check: http://43.229.133.51:3000/health"
        log_info "Webhook URL: http://43.229.133.51:4200/hooks/deploy-frontend"
        
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
    echo "  setup-webhook   Setup external webhook server (port 4200)"
    echo "  lockfile        Generate package-lock.json"
    echo "  deps            Install/fix dependencies"
    echo "  components      Create missing components"
    echo "  cleanup         Remove conflicting mobile components"
    echo "  remove-webhook  Remove standalone webhook server"
    echo "  test            Test webhook system (port 3000)"
    echo "  status          Show application status"
    echo "  logs            Show application logs"
    echo "  watch-logs      Watch deployment logs (real-time)"
    echo "  restart         Restart application"
    echo "  stop            Stop application"
    echo "  health          Check application health"
    echo "  backup          Create manual backup"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup        # First time VPS setup"
    echo "  $0 setup-webhook # Setup webhook server on port 4100"
    echo "  $0 lockfile     # Generate package-lock.json"
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
    lockfile)
        generate_lockfile
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
    setup-webhook)
        setup_webhook_server
        ;;
    remove-webhook)
        if [ -f "./remove-webhook-server.sh" ]; then
            chmod +x ./remove-webhook-server.sh
            ./remove-webhook-server.sh
        else
            echo "remove-webhook-server.sh not found"
            exit 1
        fi
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
    watch-logs)
        if [ -f "./watch-logs.sh" ]; then
            ./watch-logs.sh "${2:-live}"
        else
            echo "watch-logs.sh not found"
            exit 1
        fi
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
