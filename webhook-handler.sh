#!/bin/bash

# 🪝 Boxing Ticket Frontend - Webhook Handler
# This script handles webhook requests for auto-deployment

LOG_FILE="/var/log/boxing-ticket-webhook.log"
# Use the same APP_DIR as deploy.sh
APP_DIR="/var/www/frontend/boxing-ticket-frontend"
DEPLOY_SCRIPT="$APP_DIR/deploy.sh"
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging function
log_message() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Send Discord notification
send_discord_notification() {
    local title="$1"
    local message="$2"
    local color="$3"
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{
             \"embeds\": [{
                 \"title\": \"$title\",
                 \"description\": \"$message\",
                 \"color\": $color,
                 \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\",
                 \"footer\": {
                     \"text\": \"Webhook Auto Deploy\"
                 }
             }]
         }" \
         "$DISCORD_WEBHOOK" > /dev/null 2>&1
}

# Check if deployment is already running
check_deployment_lock() {
    local lock_file="/tmp/boxing-ticket-deploy.lock"
    
    if [ -f "$lock_file" ]; then
        local pid=$(cat "$lock_file")
        if ps -p "$pid" > /dev/null 2>&1; then
            log_message "WARNING" "Deployment already running (PID: $pid)"
            send_discord_notification "⚠️ Deployment Skipped" "Another deployment is already in progress" "16776960"
            exit 0
        else
            rm -f "$lock_file"
        fi
    fi
    
    echo $$ > "$lock_file"
    trap "rm -f $lock_file" EXIT
}

# Validate webhook request
validate_request() {
    local method="$1"
    local content_type="$2"
    
    if [ "$method" != "POST" ]; then
        log_message "ERROR" "Invalid request method: $method"
        echo "HTTP/1.1 405 Method Not Allowed"
        echo "Content-Type: application/json"
        echo ""
        echo '{"error": "Method not allowed"}'
        exit 1
    fi
}

# Parse webhook payload (lenient)
parse_payload() {
    local payload="$1"

    # Try to extract branch information if it's a git webhook
    local branch=""
    if echo "$payload" | jq -e '.ref' > /dev/null 2>&1; then
        branch=$(echo "$payload" | jq -r '.ref' | sed 's/refs\/heads\///')
    elif echo "$payload" | jq -e '.branch' > /dev/null 2>&1; then
        branch=$(echo "$payload" | jq -r '.branch')
    fi

    # Log branch but do not block deployment
    if [ -n "$branch" ]; then
        log_message "INFO" "Webhook payload branch: $branch (continuing deployment)"
    else
        log_message "INFO" "Webhook payload without branch info (continuing deployment)"
    fi

    return 0
}

# Execute deployment
execute_deployment() {
    log_message "INFO" "Starting webhook-triggered deployment"
    send_discord_notification "🚀 Webhook Deployment" "Deployment triggered via webhook on port 4300 → deploying to port 4100" "3447003"
    
    # Change to application directory
    cd "$APP_DIR" || {
        log_message "ERROR" "Failed to change to application directory"
        send_discord_notification "❌ Deployment Failed" "Could not access application directory" "16711680"
        exit 1
    }
    
    # Execute deployment script (always via bash, with generous timeout if available)
    if [ -f "$DEPLOY_SCRIPT" ]; then
        log_message "INFO" "Executing deployment script: $DEPLOY_SCRIPT"

        # Quick dependency install before full deployment
        log_message "INFO" "Installing dependencies..."
        cd "$APP_DIR"
        npm ci --production=false >> "$LOG_FILE" 2>&1 || {
            log_message "WARNING" "npm ci failed, continuing with deployment..."
        }

        if command -v timeout > /dev/null 2>&1; then
            timeout 1800 /bin/bash "$DEPLOY_SCRIPT" deploy >> "$LOG_FILE" 2>&1
        else
            /bin/bash "$DEPLOY_SCRIPT" deploy >> "$LOG_FILE" 2>&1
        fi

        if [ $? -eq 0 ]; then
            log_message "SUCCESS" "Deployment completed successfully"
            send_discord_notification "✅ Deployment Success" "Deployment completed successfully! App running on http://43.229.133.51:3000" "65280"
            echo "HTTP/1.1 200 OK"
            echo "Content-Type: application/json"
            echo ""
            echo '{"status": "success", "message": "Deployment completed successfully", "app_url": "http://43.229.133.51:3000"}'
        else
            log_message "ERROR" "Deployment failed (see $LOG_FILE)"
            send_discord_notification "❌ Deployment Failed" "Deployment failed! Check logs for details." "16711680"
            echo "HTTP/1.1 500 Internal Server Error"
            echo "Content-Type: application/json"
            echo ""
            echo '{"status": "error", "message": "Deployment failed"}'
            exit 1
        fi
    else
        log_message "ERROR" "Deployment script not found: $DEPLOY_SCRIPT"
        send_discord_notification "❌ Deployment Failed" "Deployment script not found" "16711680"
        echo "HTTP/1.1 500 Internal Server Error"
        echo "Content-Type: application/json"
        echo ""
        echo '{"status": "error", "message": "Deployment script not found"}'
        exit 1
    fi
}

# Main webhook handler
main() {
    # Create log file if possible, fallback to app logs when /var/log is not writable
    local target_log="$LOG_FILE"
    if ! mkdir -p "$(dirname "$LOG_FILE")" 2>/dev/null; then
        target_log="$APP_DIR/logs/webhook.log"
    fi
    mkdir -p "$(dirname "$target_log")" 2>/dev/null || true
    touch "$target_log" 2>/dev/null || true
    chmod 666 "$target_log" 2>/dev/null || true
    LOG_FILE="$target_log"
    
    # Get request method and content type from environment
    local method="${REQUEST_METHOD:-POST}"
    local content_type="${CONTENT_TYPE:-application/json}"
    local content_length="${CONTENT_LENGTH:-0}"
    
    log_message "INFO" "Webhook request received - Method: $method, Content-Type: $content_type"
    
    # Check if deployment is already running
    check_deployment_lock
    
    # Validate request
    validate_request "$method" "$content_type"
    
    # Read payload if present (best-effort)
    local payload=""
    if [ -n "$content_length" ] && [ "$content_length" -gt 0 ] 2>/dev/null; then
        payload=$(head -c "$content_length")
        log_message "DEBUG" "Payload received: ${payload:0:200}..."
    else
        # Some runners may not set CONTENT_LENGTH; try to read but don't block
        if read -t 0; then
            payload=$(cat)
            [ -n "$payload" ] && log_message "DEBUG" "Payload (no length): ${payload:0:200}..."
        fi
    fi
    
    # Parse payload
    parse_payload "$payload"
    
    # Execute deployment
    execute_deployment
}

# Handle different execution modes
case "${1:-webhook}" in
    webhook)
        main
        ;;
    test)
        log_message "INFO" "Testing webhook handler"
        echo "Webhook handler test completed"
        ;;
    deploy)
        check_deployment_lock
        execute_deployment
        ;;
    *)
        echo "Usage: $0 [webhook|test|deploy]"
        exit 1
        ;;
esac
