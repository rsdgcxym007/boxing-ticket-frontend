#!/bin/bash

# VPS Health Check Script
# Usage: ./health-check.sh [optional-domain-or-ip]

TARGET=${1:-"localhost:3000"}
echo "🔍 Testing VPS deployment health for: $TARGET"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_status() {
    local name=$1
    local url=$2
    local expected_type=$3
    
    echo -n "Testing $name... "
    
    response=$(curl -s -I "$url" 2>/dev/null)
    http_code=$(echo "$response" | grep -i "HTTP" | awk '{print $2}')
    content_type=$(echo "$response" | grep -i "content-type" | cut -d' ' -f2- | tr -d '\r\n')
    
    if [[ $http_code == "200" ]]; then
        if [[ -n $expected_type && $content_type == *"$expected_type"* ]]; then
            echo -e "${GREEN}✅ OK${NC} (${http_code}, ${content_type})"
        elif [[ -n $expected_type ]]; then
            echo -e "${YELLOW}⚠️  Wrong MIME${NC} (${http_code}, ${content_type})"
        else
            echo -e "${GREEN}✅ OK${NC} (${http_code})"
        fi
    else
        echo -e "${RED}❌ FAIL${NC} (${http_code:-'No response'})"
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test main page
check_status "Main Page" "http://$TARGET/"

# Test common assets (these paths will be generated during build)
check_status "CSS Asset" "http://$TARGET/_nuxt/entry.-cvR0kyN.css" "text/css"
check_status "JS Asset" "http://$TARGET/_nuxt/DCHJYpXn.js" "application/javascript"

# Test images
check_status "Logo SVG" "http://$TARGET/images/logo/LOGOFC.svg" "image/svg+xml"
check_status "Favicon" "http://$TARGET/favicon.ico" "image/"

# Test API routes (if applicable)
check_status "Thai Route" "http://$TARGET/th/"
check_status "English Route" "http://$TARGET/en/"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check PM2 status if available
if command -v pm2 &> /dev/null; then
    echo ""
    echo "📊 PM2 Status:"
    pm2 status boxing-ticket-frontend 2>/dev/null || echo "PM2 not running or app not found"
fi

echo ""
echo "🔧 Quick fixes if issues found:"
echo "1. Restart: pm2 restart boxing-ticket-frontend"
echo "2. Rebuild: npm run build && pm2 restart boxing-ticket-frontend"
echo "3. Check logs: pm2 logs boxing-ticket-frontend"
echo "4. Full reset: pm2 delete boxing-ticket-frontend && npm run pm2:start"
