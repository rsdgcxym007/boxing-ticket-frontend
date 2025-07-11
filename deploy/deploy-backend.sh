#!/bin/bash

# Backend Deployment Script for Boxing Ticket API
# Run this script in the backend project directory on EC2

echo "🚀 Deploying Boxing Ticket Backend..."

# Navigate to backend project directory
cd /var/www/boxing-ticket-backend

# Install Python dependencies
echo "📦 Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
elif [ -f "pyproject.toml" ]; then
    python3 -m venv venv
    source venv/bin/activate
    pip install .
else
    echo "⚠️ No requirements.txt or pyproject.toml found"
fi

# Install Node.js dependencies (if backend uses Node.js)
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install --production
fi

# Run database migrations (if applicable)
if [ -f "manage.py" ]; then
    echo "🗄️ Running Django migrations..."
    source venv/bin/activate
    python manage.py migrate
elif [ -f "alembic.ini" ]; then
    echo "🗄️ Running Alembic migrations..."
    source venv/bin/activate
    alembic upgrade head
fi

# Create PM2 ecosystem file for backend
if [ ! -f ecosystem.backend.config.js ]; then
    echo "📄 Creating PM2 ecosystem config for backend..."
    cat > ecosystem.backend.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'boxing-ticket-backend',
      script: 'main.py', // or your backend entry point
      interpreter: './venv/bin/python',
      cwd: '/var/www/boxing-ticket-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        HOST: '0.0.0.0'
      },
      // Logging
      log_file: '/var/log/pm2/boxing-ticket-backend.log',
      out_file: '/var/log/pm2/boxing-ticket-backend-out.log',
      error_file: '/var/log/pm2/boxing-ticket-backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto restart settings
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M'
    }
  ]
}
EOL
fi

# For Node.js backend
if [ -f "package.json" ] && [ -f "server.js" -o -f "app.js" -o -f "index.js" ]; then
    echo "📄 Creating PM2 ecosystem config for Node.js backend..."
    cat > ecosystem.backend.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'boxing-ticket-backend',
      script: 'server.js', // or app.js/index.js
      cwd: '/var/www/boxing-ticket-backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
        HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000,
        HOST: '0.0.0.0'
      },
      log_file: '/var/log/pm2/boxing-ticket-backend.log',
      out_file: '/var/log/pm2/boxing-ticket-backend-out.log',
      error_file: '/var/log/pm2/boxing-ticket-backend-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '512M'
    }
  ]
}
EOL
fi

# Stop existing PM2 processes
echo "🔄 Managing PM2 processes..."
pm2 delete boxing-ticket-backend 2>/dev/null || true

# Start the backend with PM2
echo "▶️ Starting backend..."
pm2 start ecosystem.backend.config.js

# Save PM2 configuration
pm2 save

echo "✅ Backend deployed successfully!"
echo "🌐 Backend is running on port 8000"
echo "📊 Monitor with: pm2 monit"
echo "📋 View logs with: pm2 logs boxing-ticket-backend"
