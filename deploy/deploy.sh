#!/bin/bash

# Boxing Ticket Frontend Deployment Script
echo "🚀 Starting Boxing Ticket Frontend deployment..."

# Set deployment configuration
PROJECT_NAME="boxing-ticket-frontend"
GIT_REPO_URL="https://github.com/your-username/boxing-ticket-frontend.git"
DEPLOY_DIR="/var/www/boxing-ticket-frontend"
WEBHOOK_URL="https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"

# Function to send Discord notification
send_discord_notification() {
    local message="$1"
    local color="$2"
    
    curl -H "Content-Type: application/json" \
         -X POST \
         -d "{\"embeds\": [{\"title\": \"🥊 Boxing Ticket Deployment\", \"description\": \"$message\", \"color\": $color, \"timestamp\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"}]}" \
         "$WEBHOOK_URL"
}

# Function to handle errors
handle_error() {
    local error_msg="$1"
    echo "❌ Error: $error_msg"
    send_discord_notification "❌ **Deployment Failed**\n\nError: $error_msg" 15158332
    exit 1
}

# Start deployment notification
send_discord_notification "🚀 **Deployment Started**\n\nProject: $PROJECT_NAME\nTime: $(date)" 3447003

# Create deployment directory if it doesn't exist
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "📁 Creating deployment directory..."
    sudo mkdir -p "$DEPLOY_DIR" || handle_error "Failed to create deployment directory"
    sudo chown $USER:$USER "$DEPLOY_DIR"
fi

# Navigate to deployment directory
cd "$DEPLOY_DIR" || handle_error "Failed to navigate to deployment directory"

# If repository exists, pull latest changes; otherwise clone
if [ -d ".git" ]; then
    echo "🔄 Pulling latest changes..."
    git pull origin main || handle_error "Failed to pull latest changes"
else
    echo "📥 Cloning repository..."
    git clone "$GIT_REPO_URL" . || handle_error "Failed to clone repository"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || handle_error "Failed to install dependencies"

# Copy production environment variables
if [ -f ".env.production" ]; then
    echo "🔧 Using production environment variables..."
    cp .env.production .env
else
    echo "⚠️  Warning: .env.production not found, using default settings"
fi

# Build the application
echo "🏗️  Building application..."
npm run build || handle_error "Failed to build application"

# Stop existing PM2 process if running
echo "🛑 Stopping existing processes..."
pm2 stop $PROJECT_NAME 2>/dev/null || echo "No existing process to stop"
pm2 delete $PROJECT_NAME 2>/dev/null || echo "No existing process to delete"

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js --env production || handle_error "Failed to start application with PM2"

# Save PM2 configuration
pm2 save || handle_error "Failed to save PM2 configuration"

# Health check
echo "🏥 Performing health check..."
sleep 5
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health)

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Health check passed!"
    send_discord_notification "✅ **Deployment Successful**\n\nProject: $PROJECT_NAME\nStatus: Application is running\nURL: http://43.229.133.51:3000\nTime: $(date)" 3066993
else
    handle_error "Health check failed (HTTP $HEALTH_CHECK)"
fi

echo "🎉 Deployment completed successfully!"
echo "📊 Application Status:"
pm2 status $PROJECT_NAME
