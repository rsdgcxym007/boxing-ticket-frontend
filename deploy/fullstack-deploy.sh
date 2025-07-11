#!/bin/bash

# Full Stack Deployment Script
# This script deploys both frontend and backend applications

echo "🚀 Starting full stack deployment..."

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
REQUIRED_COMMANDS=("node" "npm" "pm2" "nginx" "python3")
for cmd in "${REQUIRED_COMMANDS[@]}"; do
    if command_exists $cmd; then
        echo "✅ $cmd is installed"
    else
        echo "❌ $cmd is not installed. Please run ec2-fullstack-setup.sh first."
        exit 1
    fi
done

# Check if project directories exist
FRONTEND_DIR="/var/www/boxing-ticket-frontend"
BACKEND_DIR="/var/www/boxing-ticket-backend"

if [ ! -d "$FRONTEND_DIR" ]; then
    echo "❌ Frontend directory $FRONTEND_DIR does not exist"
    exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory $BACKEND_DIR does not exist"
    exit 1
fi

echo "🔧 Deploying Backend..."
cd $BACKEND_DIR
if [ -f "deploy/deploy-backend.sh" ]; then
    ./deploy/deploy-backend.sh
else
    echo "⚠️ Backend deployment script not found, deploying manually..."
    
    # Install dependencies based on what's available
    if [ -f "requirements.txt" ]; then
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    fi
    
    if [ -f "package.json" ]; then
        npm install --production
    fi
    
    # Start with PM2 if config exists
    if [ -f "ecosystem.backend.config.js" ]; then
        pm2 delete boxing-ticket-backend 2>/dev/null || true
        pm2 start ecosystem.backend.config.js
    fi
fi

echo "🔧 Deploying Frontend..."
cd $FRONTEND_DIR

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm ci --production

# Build application
echo "🔨 Building frontend application..."
npm run build

# Check if build was successful
if [ ! -d ".output" ]; then
    echo "❌ Frontend build failed - .output directory not found"
    exit 1
fi

# Deploy frontend with PM2
echo "🔄 Managing frontend PM2 processes..."
pm2 delete boxing-ticket-frontend 2>/dev/null || true

echo "▶️ Starting frontend application..."
pm2 start ecosystem.config.js

# Wait for applications to start
sleep 5

# Check if applications are running
echo "🔍 Checking application status..."
if pm2 list | grep -q "boxing-ticket-frontend.*online"; then
    echo "✅ Frontend started successfully"
else
    echo "❌ Frontend failed to start"
    pm2 logs boxing-ticket-frontend --lines 20
fi

if pm2 list | grep -q "boxing-ticket-backend.*online"; then
    echo "✅ Backend started successfully"
else
    echo "⚠️ Backend may not be running"
fi

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup systemd -u $USER --hp $HOME

echo "🌐 Configuring Nginx for full stack..."
# Copy the full stack nginx configuration
sudo cp $FRONTEND_DIR/deploy/nginx-fullstack.conf /etc/nginx/sites-available/boxing-ticket-fullstack

# Create symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/boxing-ticket-fullstack /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔧 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl reload nginx
    sudo systemctl enable nginx
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Final checks
echo "🔍 Final system checks..."
check_service nginx
check_service pm2-$USER

# Test application responses
echo "🧪 Testing application responses..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Frontend is responding"
else
    echo "⚠️ Frontend may not be responding correctly"
fi

if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|404\|301\|302"; then
    echo "✅ Backend is responding"
else
    echo "⚠️ Backend may not be responding correctly"
fi

echo ""
echo "🎉 Full Stack Deployment completed!"
echo ""
echo "📊 Application Status:"
pm2 status
echo ""
echo "🌐 Your applications should be accessible at:"
echo "   - Frontend: http://$(curl -s http://checkip.amazonaws.com/)"
echo "   - Backend API: http://$(curl -s http://checkip.amazonaws.com/)/api/"
echo "   - Direct Frontend: http://localhost:3000"
echo "   - Direct Backend: http://localhost:8000"
echo ""
echo "📋 Useful commands:"
echo "   - View all logs: pm2 logs"
echo "   - Monitor: pm2 monit"
echo "   - Restart frontend: pm2 restart boxing-ticket-frontend"
echo "   - Restart backend: pm2 restart boxing-ticket-backend"
echo "   - Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo ""
echo "✅ Full stack deployment successful!"
