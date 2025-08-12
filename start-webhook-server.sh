#!/bin/bash

# 🎣 Start Webhook Server on Port 4100
# This script starts the external webhook server using adnanh/webhook

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
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
WEBHOOK_PORT=4200
WEBHOOK_CONFIG="/var/www/frontend/boxing-ticket-frontend/webhook-config.json"
WEBHOOK_LOG="/var/log/frontend/webhook.log"

# Check if webhook is installed
if ! command -v webhook &> /dev/null; then
    log_error "webhook binary not found. Please install adnanh/webhook:"
    echo "  sudo apt update"
    echo "  sudo apt install webhook"
    echo "  # OR"
    echo "  wget https://github.com/adnanh/webhook/releases/download/2.8.0/webhook-linux-amd64.tar.gz"
    echo "  tar -xzf webhook-linux-amd64.tar.gz"
    echo "  sudo mv webhook-linux-amd64/webhook /usr/local/bin/"
    exit 1
fi

# Check if config exists
if [ ! -f "$WEBHOOK_CONFIG" ]; then
    log_error "Webhook config not found: $WEBHOOK_CONFIG"
    exit 1
fi

# Create log directory
sudo mkdir -p "$(dirname "$WEBHOOK_LOG")"
sudo chown -R "$USER:$USER" "$(dirname "$WEBHOOK_LOG")"

log_info "Starting webhook server on port $WEBHOOK_PORT..."
log_info "Config: $WEBHOOK_CONFIG"
log_info "Log: $WEBHOOK_LOG"

# Start webhook server
exec webhook \
    -hooks "$WEBHOOK_CONFIG" \
    -port "$WEBHOOK_PORT" \
    -hotreload \
    -verbose \
    -logfile "$WEBHOOK_LOG" \
    -ip "0.0.0.0"
