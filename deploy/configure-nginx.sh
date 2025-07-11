#!/bin/bash

# Nginx Configuration Script
# Run this script to configure Nginx for the Boxing Ticket Frontend

echo "🌐 Configuring Nginx..."

# Copy the nginx configuration
sudo cp /var/www/boxing-ticket-frontend/deploy/nginx.conf /etc/nginx/sites-available/boxing-ticket-frontend

# Create symbolic link to enable the site
sudo ln -sf /etc/nginx/sites-available/boxing-ticket-frontend /etc/nginx/sites-enabled/

# Remove default nginx site (optional)
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
echo "🔧 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    
    # Reload nginx
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    
    # Enable nginx to start on boot
    sudo systemctl enable nginx
    
    echo "✅ Nginx configured successfully!"
    echo "🌐 Your site should be accessible via your domain/IP"
else
    echo "❌ Nginx configuration has errors. Please check the configuration file."
    exit 1
fi
