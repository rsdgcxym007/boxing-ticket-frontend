#!/bin/bash
# Quick PM2 cleanup script

# Colors
RED="[0;31m"
GREEN="[0;32m"
YELLOW="[1;33m"
NC="[0m"

echo -e "${YELLOW}🧹 Cleaning up PM2 duplicate processes...${NC}"

# Stop all PM2 processes
echo -e "${YELLOW}Stopping all PM2 processes...${NC}"
pm2 stop all 2>/dev/null || true

# Delete all instances
echo -e "${YELLOW}Deleting boxing-ticket-frontend processes...${NC}"
pm2 delete boxing-ticket-frontend 2>/dev/null || true
pm2 delete ecosystem.config.cjs 2>/dev/null || true

# Kill all PM2 processes and clear cache
echo -e "${YELLOW}Resetting PM2...${NC}"
pm2 kill 2>/dev/null || true

# Show current status
echo -e "${GREEN}✅ PM2 cleanup completed!${NC}"
echo -e "${YELLOW}Current PM2 status:${NC}"
pm2 list

