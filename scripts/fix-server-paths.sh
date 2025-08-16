#!/bin/bash

# Force Fix Server Deployment Script
# This script will SSH to server and fix the deployment path issue

set -e

SERVER_HOST="43.229.133.51"
SERVER_USER="root"
PROJECT_DIR="/var/www/patongboxing-frontend"

echo "🚀 Connecting to server to fix deployment script paths..."

ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
set -e

PROJECT_DIR="/var/www/patongboxing-frontend"
SCRIPT_PATH="$PROJECT_DIR/scripts/webhook-deploy.sh"

echo "🔍 Checking current deployment script..."

if [ -f "$SCRIPT_PATH" ]; then
    echo "✅ Found webhook-deploy.sh"
    
    # Check if the file contains the wrong path
    if grep -q "/var/www/patongboxing-frontend/source" "$SCRIPT_PATH"; then
        echo "❌ Found incorrect path in script"
        echo "🔧 Fixing path issue..."
        
        # Create backup
        cp "$SCRIPT_PATH" "$SCRIPT_PATH.backup.$(date +%Y%m%d_%H%M%S)"
        
        # Fix the path
        sed -i 's|/var/www/patongboxing-frontend/source|/var/www/patongboxing-frontend|g' "$SCRIPT_PATH"
        
        echo "✅ Path fixed in deployment script"
        echo "📄 Script content after fix:"
        head -n 20 "$SCRIPT_PATH"
    else
        echo "✅ Script already has correct path"
    fi
else
    echo "❌ webhook-deploy.sh not found at $SCRIPT_PATH"
    echo "📁 Available files in scripts directory:"
    ls -la "$PROJECT_DIR/scripts/" 2>/dev/null || echo "Scripts directory not found"
fi

# Also check if there are any other files with the wrong path
echo "🔍 Checking for any files with wrong paths..."
grep -r "patongboxing-frontend/source" "$PROJECT_DIR" 2>/dev/null || echo "✅ No files found with wrong path"

echo "✅ Server check completed"

ENDSSH

echo "🎉 Server fix completed!"
