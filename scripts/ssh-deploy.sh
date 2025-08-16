#!/bin/bash

# =============================================================================
# Simple SSH Deploy Script - Direct Connection
# =============================================================================

# Configuration
SERVER_HOST="43.229.133.51"
SERVER_USER="root"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🥊 Patong Boxing Stadium - SSH Direct Deploy${NC}"
echo -e "${YELLOW}Connecting to ${SERVER_USER}@${SERVER_HOST}...${NC}"
echo ""

# SSH directly to server
ssh -o StrictHostKeyChecking=no "${SERVER_USER}@${SERVER_HOST}"
