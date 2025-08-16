#!/bin/bash

# =============================================================================
# GitHub Webhook Handler for Patong Boxing Stadium
# =============================================================================

set -e

# Configuration
DISCORD_WEBHOOK="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
DEPLOY_SCRIPT="/var/www/patongboxing-frontend/scripts/auto-deploy.sh"
WEBHOOK_PORT=9000
WEBHOOK_PATH="/webhook"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Discord notification
send_discord_notification() {
    local message="$1"
    local color="${2:-3447003}"
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{
             \"embeds\": [{
                 \"title\": \"🎣 Webhook Triggered\",
                 \"description\": \"${message}\",
                 \"color\": ${color},
                 \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
             }]
         }" \
         "$DISCORD_WEBHOOK" > /dev/null 2>&1
}

# Log function
log() {
    local level="$1"
    local message="$2"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp] $level:${NC} $message"
}

# Webhook handler function
handle_webhook() {
    local payload="$1"
    
    # Parse GitHub payload
    local event_type=$(echo "$payload" | jq -r '.zen // empty')
    local ref=$(echo "$payload" | jq -r '.ref // empty')
    local repository=$(echo "$payload" | jq -r '.repository.name // empty')
    local pusher=$(echo "$payload" | jq -r '.pusher.name // empty')
    local commit_message=$(echo "$payload" | jq -r '.head_commit.message // empty')
    
    log "INFO" "Webhook received:"
    log "INFO" "Repository: $repository"
    log "INFO" "Branch: $ref"
    log "INFO" "Pusher: $pusher"
    log "INFO" "Commit: $commit_message"
    
    # Check if this is a push to our target branch
    if [[ "$ref" == "refs/heads/featues/v1" && "$repository" == "boxing-ticket-frontend" ]]; then
        log "INFO" "Valid push detected. Starting deployment..."
        
        send_discord_notification "🚨 **GitHub Webhook Triggered!**\n\n📦 **Repository:** $repository\n🌿 **Branch:** featues/v1\n👤 **Pusher:** $pusher\n💬 **Commit:** \`$commit_message\`\n\n⏳ **Starting auto deployment...**" "3447003"
        
        # Execute deployment script
        if [ -f "$DEPLOY_SCRIPT" ]; then
            chmod +x "$DEPLOY_SCRIPT"
            bash "$DEPLOY_SCRIPT" &
            log "SUCCESS" "Deployment started in background"
        else
            log "ERROR" "Deploy script not found: $DEPLOY_SCRIPT"
            send_discord_notification "❌ **Deployment Error**\n\nDeploy script not found!" "15158332"
        fi
    else
        log "INFO" "Ignoring webhook (wrong branch or repository)"
        if [[ "$event_type" ]]; then
            # This is likely a ping event
            send_discord_notification "🏓 **Webhook Ping**\n\nGitHub webhook is connected and working!" "65280"
        fi
    fi
}

# Start webhook server
start_webhook_server() {
    log "INFO" "Starting webhook server on port $WEBHOOK_PORT"
    send_discord_notification "🚀 **Webhook Server Starting**\n\nListening on port $WEBHOOK_PORT for GitHub events" "3447003"
    
    # Simple webhook server using netcat and bash
    while true; do
        # Listen for connections
        {
            # Read HTTP request
            read -r request
            
            # Skip headers until empty line
            while read -r header && [ "$header" != $'\r' ]; do
                if [[ "$header" =~ ^Content-Length:\ ([0-9]+) ]]; then
                    content_length="${BASH_REMATCH[1]}"
                fi
            done
            
            # Read POST body if Content-Length is set
            if [ -n "$content_length" ] && [ "$content_length" -gt 0 ]; then
                payload=$(head -c "$content_length")
                
                log "INFO" "Received webhook payload"
                
                # Handle the webhook
                handle_webhook "$payload"
                
                # Send HTTP response
                echo -e "HTTP/1.1 200 OK\r"
                echo -e "Content-Type: application/json\r"
                echo -e "Content-Length: 25\r"
                echo -e "\r"
                echo -e '{"status": "success"}'
            else
                # Send simple response for GET requests
                echo -e "HTTP/1.1 200 OK\r"
                echo -e "Content-Type: text/plain\r"
                echo -e "Content-Length: 32\r"
                echo -e "\r"
                echo -e 'Patong Boxing Webhook Server'
            fi
        } | nc -l -p "$WEBHOOK_PORT" -q 1
        
        sleep 1
    done
}

# Main execution
case "${1:-start}" in
    "start")
        start_webhook_server
        ;;
    "test")
        log "INFO" "Testing webhook handler..."
        test_payload='{"ref":"refs/heads/featues/v1","repository":{"name":"boxing-ticket-frontend"},"pusher":{"name":"test-user"},"head_commit":{"message":"Test commit"}}'
        handle_webhook "$test_payload"
        ;;
    *)
        echo "Usage: $0 {start|test}"
        exit 1
        ;;
esac
