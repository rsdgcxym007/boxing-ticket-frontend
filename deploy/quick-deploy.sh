#!/bin/bash

# Quick Deployment Script
# This script automates the entire deployment process

echo "🚀 Starting automated deployment to EC2..."

# Check if we're running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ This script should not be run as root"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check service status
check_service() {
    systemctl is-active --quiet $1 && echo "✅ $1 is running" || echo "❌ $1 is not running"
}

echo "📋 Pre-deployment checks..."

# Check if required commands exist
REQUIRED_COMMANDS=("node" "npm" "pm2" "nginx")
for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if command_exists $cmd; then
        echo "✅ $cmd is installed"
    else
        echo "❌ $cmd is not installed. Please run ec2-setup.sh first."
        exit 1
    fi
done

# Navigate to project directory
PROJECT_DIR="/var/www/boxing-ticket-frontend"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ Project directory $PROJECT_DIR does not exist"
    echo "Please upload your project files first"
    exit 1
fi

cd $PROJECT_DIR

echo "📦 Installing dependencies..."
npm ci --production

echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -d ".output" ]; then
    echo "❌ Build failed - .output directory not found"
    exit 1
fi

echo "🔄 Managing PM2 processes..."
pm2 delete boxing-ticket-frontend 2>/dev/null || true

echo "▶️ Starting application with PM2..."
pm2 start ecosystem.config.js

# Wait a moment for the app to start
sleep 5

# Check if application is running
if pm2 list | grep -q "boxing-ticket-frontend.*online"; then
    echo "✅ Application started successfully"
else
    echo "❌ Application failed to start"
    pm2 logs boxing-ticket-frontend --lines 20
    exit 1
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u $USER --hp $HOME

echo "🌐 Configuring Nginx..."
./deploy/configure-nginx.sh

# Final checks
echo "🔍 Final system checks..."
check_service nginx
check_service pm2-$USER

# Test if application is responding
echo "🧪 Testing application response..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Application is responding"
else
    echo "⚠️ Application may not be responding correctly"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🌐 Your application should be accessible at:"
echo "   - http://$(curl -s http://checkip.amazonaws.com/)"
echo "   - http://localhost:3000 (direct)"
echo ""
echo "📋 Useful commands:"
echo "   - View logs: pm2 logs boxing-ticket-frontend"
echo "   - Monitor: pm2 monit"
echo "   - Restart: pm2 restart boxing-ticket-frontend"
echo "   - Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "✅ Deployment successful!"
