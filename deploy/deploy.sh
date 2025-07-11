#!/bin/bash

# Deployment Script for Boxing Ticket Frontend
# Run this script in your project directory on EC2

echo "🚀 Deploying Boxing Ticket Frontend..."

# Navigate to project directory
cd /var/www/boxing-ticket-frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Create PM2 ecosystem file if it doesn't exist
if [ ! -f ecosystem.config.js ]; then
    echo "📄 Creating PM2 ecosystem config..."
    cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'boxing-ticket-frontend',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
}
EOL
fi

# Stop existing PM2 processes
echo "🔄 Managing PM2 processes..."
pm2 delete boxing-ticket-frontend 2>/dev/null || true

# Start the application with PM2
echo "▶️ Starting application..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u $USER --hp $HOME

echo "✅ Application deployed successfully!"
echo "🌐 Your application is running on port 3000"
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs with: pm2 logs boxing-ticket-frontend"
