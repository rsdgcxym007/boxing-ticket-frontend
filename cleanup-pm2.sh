#!/bin/bash
# Safe PM2 cleanup script - Only targets boxing-ticket-frontend

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m"

PM2_APP_NAME="boxing-ticket-frontend"

echo -e "${YELLOW}🧹 Cleaning up PM2 duplicate processes (boxing-ticket-frontend only)...${NC}"

# Stop only our specific application
echo -e "${YELLOW}Stopping boxing-ticket-frontend processes...${NC}"
pm2 stop "$PM2_APP_NAME" 2>/dev/null || true

# Delete only our specific instances
echo -e "${YELLOW}Deleting boxing-ticket-frontend processes...${NC}"
pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
pm2 delete ecosystem.config.cjs 2>/dev/null || true
pm2 delete ecosystem.config.mjs 2>/dev/null || true

# Clean up any remaining boxing-ticket-frontend processes by ID
echo -e "${YELLOW}Checking for remaining boxing-ticket-frontend processes...${NC}"
pm2_processes=$(pm2 jlist 2>/dev/null || echo "[]")
if [ "$pm2_processes" != "[]" ]; then
    echo "$pm2_processes" | jq -r '.[] | select(.name == "boxing-ticket-frontend") | .pm_id' 2>/dev/null | while read -r process_id; do
        if [ -n "$process_id" ] && [ "$process_id" != "null" ]; then
            echo -e "${YELLOW}Removing remaining boxing-ticket-frontend process ID: $process_id${NC}"
            pm2 delete "$process_id" 2>/dev/null || true
        fi
    done
fi

# Save the updated PM2 list (without boxing-ticket-frontend)
pm2 save 2>/dev/null || true

# Show current status
echo -e "${GREEN}✅ PM2 cleanup completed (only boxing-ticket-frontend affected)!${NC}"
echo -e "${YELLOW}Current PM2 status:${NC}"
pm2 list

