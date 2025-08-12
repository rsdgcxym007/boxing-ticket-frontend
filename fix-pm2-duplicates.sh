#!/bin/bash
# Fix PM2 Duplicates - Advanced cleanup for boxing-ticket-frontend

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
NC="\033[0m"

PM2_APP_NAME="boxing-ticket-frontend"

echo -e "${BLUE}🔧 Advanced PM2 Duplicate Fix for $PM2_APP_NAME${NC}"
echo "=================================================="

# Function to get boxing-ticket-frontend process IDs
get_boxing_processes() {
    pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend") | .pm_id' 2>/dev/null || echo ""
}

# Show current status
echo -e "${YELLOW}Current PM2 status:${NC}"
pm2 list

# Get all boxing-ticket-frontend processes
boxing_processes=$(get_boxing_processes)

if [ -z "$boxing_processes" ]; then
    echo -e "${GREEN}✅ No boxing-ticket-frontend processes found${NC}"
    exit 0
fi

echo -e "${YELLOW}Found boxing-ticket-frontend processes with IDs:${NC}"
echo "$boxing_processes"

# Count processes
process_count=$(echo "$boxing_processes" | wc -w)
echo -e "${YELLOW}Total processes found: $process_count${NC}"

if [ "$process_count" -gt 1 ]; then
    echo -e "${RED}⚠️  Multiple boxing-ticket-frontend processes detected!${NC}"
    echo -e "${YELLOW}Removing all instances...${NC}"
    
    # Remove all boxing-ticket-frontend processes
    echo "$boxing_processes" | while read -r process_id; do
        if [ -n "$process_id" ]; then
            echo -e "${YELLOW}Stopping and deleting process ID: $process_id${NC}"
            pm2 stop "$process_id" 2>/dev/null || true
            pm2 delete "$process_id" 2>/dev/null || true
        fi
    done
    
    # Also try by name
    pm2 stop "$PM2_APP_NAME" 2>/dev/null || true
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    
    # Clean up ecosystem configs
    pm2 delete ecosystem.config.cjs 2>/dev/null || true
    pm2 delete ecosystem.config.mjs 2>/dev/null || true
    
    echo -e "${GREEN}✅ All boxing-ticket-frontend processes removed${NC}"
    
elif [ "$process_count" -eq 1 ]; then
    echo -e "${GREEN}✅ Only one boxing-ticket-frontend process found - no duplicates${NC}"
fi

# Wait a moment
sleep 2

# Show final status
echo -e "${YELLOW}Final PM2 status:${NC}"
pm2 list

# Save PM2 configuration
echo -e "${YELLOW}Saving PM2 configuration...${NC}"
pm2 save 2>/dev/null || true

echo -e "${GREEN}🎉 PM2 duplicate fix completed!${NC}"
