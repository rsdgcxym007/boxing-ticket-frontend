#!/bin/bash

# EC2 Setup Script for Boxing Ticket Frontend
# Run this script on your EC2 instance after connecting via SSH

echo "🚀 Setting up Boxing Ticket Frontend on EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo "📥 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
echo "✅ Verifying installations..."
node --version
npm --version

# Install PM2 globally for process management
echo "🔧 Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/boxing-ticket-frontend
sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend

# Clone or prepare for file upload
echo "📋 Application directory ready at: /var/www/boxing-ticket-frontend"
echo "Next steps:"
echo "1. Upload your project files to /var/www/boxing-ticket-frontend"
echo "2. Run the deployment script: ./deploy.sh"

echo "✅ EC2 setup completed!"
