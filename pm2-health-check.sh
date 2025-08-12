#!/bin/bash
# Complete PM2 Health Check and Duplicate Prevention Script

# Colors
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
BLUE="\033[0;34m"
PURPLE="\033[0;35m"
NC="\033[0m"

PM2_APP_NAME="boxing-ticket-frontend"
EXPECTED_INSTANCES=1

echo -e "${BLUE}🏥 PM2 Health Check for $PM2_APP_NAME${NC}"
echo "=================================================="

# Function to get process count
get_process_count() {
    pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend") | .pm_id' 2>/dev/null | wc -l
}

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -ti:$port > /dev/null 2>&1; then
        echo -e "${RED}❌ Port $port is in use${NC}"
        lsof -i:$port
        return 1
    else
        echo -e "${GREEN}✅ Port $port is available${NC}"
        return 0
    fi
}

# Function to show PM2 status with details
show_pm2_status() {
    echo -e "${YELLOW}Current PM2 Status:${NC}"
    pm2 list
    echo ""
    
    # Show detailed info for boxing-ticket-frontend processes
    local boxing_processes=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend")')
    if [ -n "$boxing_processes" ]; then
        echo -e "${YELLOW}Boxing Ticket Frontend Process Details:${NC}"
        echo "$boxing_processes" | jq -r '"\(.pm_id): \(.name) - PID: \(.pid) - Status: \(.pm2_env.status) - CPU: \(.monit.cpu)% - Memory: \(.monit.memory | tonumber / 1024 / 1024 | floor)MB"'
        echo ""
    fi
}

# Main health check
echo -e "${PURPLE}📊 Running health diagnostics...${NC}"

# Check PM2 daemon
if ! pm2 ping > /dev/null 2>&1; then
    echo -e "${RED}❌ PM2 daemon is not running${NC}"
    echo -e "${YELLOW}Starting PM2 daemon...${NC}"
    pm2 ping
fi

# Show current status
show_pm2_status

# Check process count
process_count=$(get_process_count)
echo -e "${YELLOW}Process Analysis:${NC}"
echo "Expected instances: $EXPECTED_INSTANCES"
echo "Current instances: $process_count"

if [ "$process_count" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No boxing-ticket-frontend processes running${NC}"
    echo -e "${BLUE}To start the application, run:${NC}"
    echo "pm2 start ecosystem.config.cjs --env production"
    
elif [ "$process_count" -eq "$EXPECTED_INSTANCES" ]; then
    echo -e "${GREEN}✅ Correct number of instances running${NC}"
    
    # Check if they're healthy
    unhealthy_count=$(pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend" and .pm2_env.status != "online") | .pm_id' 2>/dev/null | wc -l)
    
    if [ "$unhealthy_count" -gt 0 ]; then
        echo -e "${RED}❌ $unhealthy_count processes are not healthy${NC}"
    else
        echo -e "${GREEN}✅ All processes are healthy${NC}"
    fi
    
elif [ "$process_count" -gt "$EXPECTED_INSTANCES" ]; then
    echo -e "${RED}❌ TOO MANY INSTANCES! Found $process_count, expected $EXPECTED_INSTANCES${NC}"
    echo -e "${YELLOW}This indicates duplicate processes${NC}"
    
    echo -e "${BLUE}Would you like to fix this automatically? (y/n)${NC}"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Running duplicate fix...${NC}"
        ./fix-pm2-duplicates.sh
    else
        echo -e "${YELLOW}Manual fix recommended: Run ./fix-pm2-duplicates.sh${NC}"
    fi
fi

# Check port availability
echo -e "${YELLOW}Port Check:${NC}"
check_port 3000

# Check memory usage
echo -e "${YELLOW}Memory Usage Check:${NC}"
pm2 jlist 2>/dev/null | jq -r '.[] | select(.name == "boxing-ticket-frontend") | "Process \(.pm_id): \(.monit.memory | tonumber / 1024 / 1024 | floor)MB"' 2>/dev/null

# Check for zombie Node.js processes
echo -e "${YELLOW}Zombie Process Check:${NC}"
zombie_processes=$(ps aux | grep -E "node.*boxing|boxing.*node" | grep -v grep | grep -v "pm2" || echo "")
if [ -n "$zombie_processes" ]; then
    echo -e "${RED}❌ Found potential zombie processes:${NC}"
    echo "$zombie_processes"
else
    echo -e "${GREEN}✅ No zombie processes found${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}📋 Health Check Summary:${NC}"
echo "================================"

if [ "$process_count" -eq "$EXPECTED_INSTANCES" ] && [ "$unhealthy_count" -eq 0 ] && check_port 3000 > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 System is healthy!${NC}"
    exit 0
elif [ "$process_count" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Application is not running${NC}"
    exit 1
else
    echo -e "${RED}⚠️  Issues detected - manual intervention may be required${NC}"
    echo -e "${BLUE}Available commands:${NC}"
    echo "• ./fix-pm2-duplicates.sh - Fix duplicate processes"
    echo "• ./pre-deploy-cleanup.sh - Complete cleanup before redeploy"
    echo "• pm2 start ecosystem.config.cjs --env production - Start fresh"
    exit 1
fi
