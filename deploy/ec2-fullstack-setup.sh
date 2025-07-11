#!/bin/bash

# EC2 Setup Script for Boxing Ticket Full Stack (Frontend + Backend)
# Run this script on your EC2 instance after connecting via SSH

echo "🚀 Setting up Boxing Ticket Full Stack on EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo "📥 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Python and pip (for backend dependencies)
echo "🐍 Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# Install PostgreSQL (if needed for database)
echo "🗄️ Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install Redis (for caching and sessions)
echo "📦 Installing Redis..."
sudo apt install -y redis-server

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version
python3 --version
pip3 --version
psql --version
redis-server --version

# Install PM2 globally for process management
echo "🔧 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Create application directories
echo "📁 Creating application directories..."
sudo mkdir -p /var/www/boxing-ticket-frontend
sudo mkdir -p /var/www/boxing-ticket-backend
sudo mkdir -p /var/log/pm2

# Set proper permissions
sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend
sudo chown -R $USER:$USER /var/www/boxing-ticket-backend
sudo chown -R $USER:$USER /var/log/pm2

# Setup PostgreSQL (optional)
echo "🗄️ Setting up PostgreSQL..."
sudo -u postgres createuser --interactive --pwprompt boxinguser || true
sudo -u postgres createdb boxing_tickets || true

# Configure Redis
echo "📦 Configuring Redis..."
sudo systemctl enable redis-server
sudo systemctl start redis-server

echo "📋 Application directories ready:"
echo "   - Frontend: /var/www/boxing-ticket-frontend"
echo "   - Backend: /var/www/boxing-ticket-backend"
echo ""
echo "Next steps:"
echo "1. Upload your project files to respective directories"
echo "2. Configure environment variables for both projects"
echo "3. Run the deployment scripts"

echo "✅ EC2 full stack setup completed!"
