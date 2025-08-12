#!/bin/bash
# Pre-deployment cleanup script - Ensures clean PM2 state before deployment

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

PM2_APP_NAME="boxing-ticket-frontend"

echo -e "${BLUE}🧹 Pre-deployment cleanup for $PM2_APP_NAME${NC}"
echo "=================================================="

# Function to safely check if PM2 is running
check_pm2() {
    pm2 ping 2>/dev/null | grep -q "pong" || {
        echo -e "${YELLOW}⚠️  PM2 daemon not running, starting...${NC}"
        pm2 ping > /dev/null 2>&1
    }
}

# Function to get all boxing-ticket-frontend processes
get_boxing_processes() {
    pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend") | .pm_id' 2>/dev/null || echo ""
}

# Check PM2 status
check_pm2

echo -e "${YELLOW}Current PM2 status before cleanup:${NC}"
pm2 list

# Stop all boxing-ticket-frontend processes
echo -e "${YELLOW}Stopping all boxing-ticket-frontend processes...${NC}"
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

# Get all boxing-ticket-frontend processes
boxing_processes=$(get_boxing_processes)

if [ -n "$boxing_processes" ]; then
    echo -e "${YELLOW}Found boxing-ticket-frontend processes, removing them...${NC}"
    
    # Remove each process by ID
    echo "$boxing_processes" | while read -r process_id; do
        if [ -n "$process_id" ]; then
            echo -e "${YELLOW}Deleting process ID: $process_id${NC}"
            pm2 delete "$process_id" 2>/dev/null || true
        fi
    done
fi

# Also try to delete by name (catches any missed processes)
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true

# Clean up any ecosystem config references
pm2 delete ecosystem.config.cjs 2>/dev/null || true
pm2 delete ecosystem.config.mjs 2>/dev/null || true
pm2 delete ecosystem.config.js 2>/dev/null || true

# Remove any orphaned processes with similar names
echo -e "${YELLOW}Checking for orphaned processes...${NC}"
pm2 jlist 2>/dev/null | jq -r '.[] | select(.name | contains("boxing")) | .pm_id' 2>/dev/null | while read -r process_id; do
    if [ -n "$process_id" ]; then
        echo -e "${YELLOW}Removing orphaned boxing-related process ID: $process_id${NC}"
        pm2 delete "$process_id" 2>/dev/null || true
    fi
done

# Kill any node processes that might be using port 3000 (in case of zombie processes)
echo -e "${YELLOW}Checking for processes on port 3000...${NC}"
port_pid=$(lsof -ti:3000 2>/dev/null || echo "")
if [ -n "$port_pid" ]; then
    echo -e "${YELLOW}Found process on port 3000 (PID: $port_pid), killing...${NC}"
    kill -9 $port_pid 2>/dev/null || true
fi

# Save PM2 configuration
echo -e "${YELLOW}Saving PM2 configuration...${NC}"
pm2 save 2>/dev/null || true

# Clean PM2 logs
echo -e "${YELLOW}Cleaning PM2 logs...${NC}"
pm2 flush 2>/dev/null || true

# Final status check
echo -e "${GREEN}✅ Pre-deployment cleanup completed!${NC}"
echo -e "${YELLOW}Final PM2 status:${NC}"
pm2 list

# Verify port 3000 is free
if lsof -ti:3000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Port 3000 is still in use!${NC}"
    lsof -i:3000
    exit 1
else
    echo -e "${GREEN}✅ Port 3000 is available${NC}"
fi

echo -e "${GREEN}🎉 System ready for deployment!${NC}"
