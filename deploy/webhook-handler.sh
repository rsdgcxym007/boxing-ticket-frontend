#!/bin/bash

# Boxing Ticket Frontend Webhook Handler
echo "🎯 Webhook handler started on port 4100"

# Configuration
PORT=4100
PROJECT_DIR="/var/www/frontend/boxing-ticket-frontend"
WEBHOOK_SECRET="boxing-ticket-webhook-2024"
LOG_FILE="/var/log/webhook-deploy.log"

# Create log file if it doesn't exist
sudo touch "$LOG_FILE" 2>/dev/null || LOG_FILE="./webhook-deploy.log"

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to handle webhook requests
handle_webhook() {
    local method="$1"
    local path="$2"
    local query="$3"
    
    log_message "Webhook received: $method $path $query"
    
    # Only handle POST requests to /hooks/deploy-frontend
    if [ "$method" = "POST" ] && [ "$path" = "/hooks/deploy-frontend" ]; then
        log_message "Starting deployment process..."
        
        # Run deployment in background
        (
            cd "$PROJECT_DIR" || {
                log_message "Error: Cannot access project directory $PROJECT_DIR"
                exit 1
            }
            
            # Execute deployment script
            if [ -f "deploy/deploy.sh" ]; then
                bash deploy/deploy.sh >> "$LOG_FILE" 2>&1
                log_message "Deployment script completed with exit code: $?"
            else
                log_message "Error: Deployment script not found at deploy/deploy.sh"
            fi
        ) &
        
        # Return success response
        echo "HTTP/1.1 200 OK"
        echo "Content-Type: application/json"
        echo "Content-Length: 54"
        echo ""
        echo '{"status":"success","message":"Deployment started"}'
    else
        # Return 404 for other requests
        echo "HTTP/1.1 404 Not Found"
        echo "Content-Type: application/json"
        echo "Content-Length: 47"
        echo ""
        echo '{"status":"error","message":"Endpoint not found"}'
    fi
}

# Simple HTTP server using netcat
while true; do
    log_message "Listening for webhook requests on port $PORT..."
    
    # Read HTTP request
    {
        read -r method path protocol
        
        # Read headers
        while IFS= read -r header && [ "$header" != $'\r' ]; do
            # Process headers if needed
            :
        done
        
        # Handle the request
        handle_webhook "$method" "$path" ""
        
    } | nc -l -p "$PORT"
    
    # Small delay before next iteration
    sleep 1
done
