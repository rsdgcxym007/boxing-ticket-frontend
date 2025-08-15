#!/bin/bash

# 🗄️ Quick Database Setup Script for Patong Boxing Stadium
# Run this script to quickly create the database with exact specifications

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Database configuration - EXACT MATCH
DB_HOST="43.229.133.51"
DB_PORT="5432"
DB_USERNAME="boxing_user"
DB_PASSWORD="Password123!"
DB_NAME="patong_boxing_stadium"
DB_SSL="false"
DB_SYNCHRONIZE="false"
DB_LOGGING="false"

echo -e "${BLUE}🗄️  Quick Database Setup - Patong Boxing Stadium${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ This script must be run as root${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Ensuring PostgreSQL is installed...${NC}"

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    apt update
    apt install -y postgresql postgresql-contrib
    systemctl start postgresql
    systemctl enable postgresql
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL already installed${NC}"
fi

echo -e "${YELLOW}🗄️  Creating database with exact specifications...${NC}"

# Create database and user with exact specifications
sudo -u postgres psql << EOF
-- Drop existing database and user for clean setup
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USERNAME;

-- Create database
CREATE DATABASE $DB_NAME;

-- Create user with exact password
CREATE USER $DB_USERNAME WITH PASSWORD '$DB_PASSWORD';

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USERNAME;
ALTER USER $DB_USERNAME CREATEDB;

-- Connect to the database
\c $DB_NAME;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO $DB_USERNAME;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USERNAME;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USERNAME;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USERNAME;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USERNAME;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USERNAME;

-- Verify setup
SELECT 'Database setup completed successfully!' AS status;
SELECT current_database() as database, current_user as user;
EOF

echo -e "${GREEN}✅ Database created with exact specifications${NC}"

echo -e "${YELLOW}⚙️  Configuring PostgreSQL for remote access...${NC}"

# Get PostgreSQL version
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
PG_MAJOR=$(echo $PG_VERSION | cut -d. -f1)
PG_CONFIG="/etc/postgresql/$PG_MAJOR/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_MAJOR/main/pg_hba.conf"

# Backup configs
cp "$PG_CONFIG" "$PG_CONFIG.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true
cp "$PG_HBA" "$PG_HBA.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true

# Configure for remote access
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONFIG"
sed -i "s/#port = 5432/port = 5432/" "$PG_CONFIG"

# Add authentication rules (remove existing rules for this database first)
sed -i "/host.*$DB_NAME.*$DB_USERNAME/d" "$PG_HBA"
cat >> "$PG_HBA" << PGHBA

# Patong Boxing Stadium Database - Remote Access
host    $DB_NAME    $DB_USERNAME    0.0.0.0/0    md5
PGHBA

echo -e "${YELLOW}🔄 Restarting PostgreSQL...${NC}"

# Restart PostgreSQL
systemctl restart postgresql

# Check if PostgreSQL is running
if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL restarted successfully${NC}"
else
    echo -e "${RED}❌ PostgreSQL failed to restart${NC}"
    exit 1
fi

echo -e "${YELLOW}🔓 Opening firewall port...${NC}"

# Open PostgreSQL port in firewall
if command -v ufw &> /dev/null; then
    ufw allow 5432/tcp
    echo -e "${GREEN}✅ Port 5432 opened in UFW firewall${NC}"
else
    echo -e "${YELLOW}⚠️  UFW not installed, manually open port 5432${NC}"
fi

echo -e "${YELLOW}📝 Creating environment configuration file...${NC}"

# Create environment file
mkdir -p /var/www/patongboxing
cat > /var/www/patongboxing/.env.database << ENV
# PostgreSQL Database Configuration - Patong Boxing Stadium
DATABASE_HOST=$DB_HOST
DATABASE_PORT=$DB_PORT
DATABASE_USERNAME=$DB_USERNAME
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_NAME=$DB_NAME
DATABASE_SSL=$DB_SSL
DATABASE_SYNCHRONIZE=$DB_SYNCHRONIZE
DATABASE_LOGGING=$DB_LOGGING

# Connection URL
DATABASE_URL=postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
ENV

# Set proper ownership if deploy user exists
if id "deploy" &>/dev/null; then
    chown deploy:deploy /var/www/patongboxing/.env.database
fi

echo -e "${YELLOW}🧪 Testing database connections...${NC}"

# Test local connection
echo -n "Testing local connection... "
if sudo -u postgres psql -h localhost -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -c "SELECT 'OK' as status;" &>/dev/null; then
    echo -e "${GREEN}✅ Success${NC}"
else
    echo -e "${RED}❌ Failed${NC}"
fi

# Test remote connection
echo -n "Testing remote connection... "
if sudo -u postgres psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME -c "SELECT 'OK' as status;" &>/dev/null; then
    echo -e "${GREEN}✅ Success${NC}"
else
    echo -e "${YELLOW}⚠️  May require password prompt${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Database Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Database Configuration:${NC}"
echo -e "${YELLOW}Host:${NC} $DB_HOST"
echo -e "${YELLOW}Port:${NC} $DB_PORT"
echo -e "${YELLOW}Database:${NC} $DB_NAME"
echo -e "${YELLOW}Username:${NC} $DB_USERNAME"
echo -e "${YELLOW}Password:${NC} $DB_PASSWORD"
echo -e "${YELLOW}SSL:${NC} $DB_SSL"
echo -e "${YELLOW}Synchronize:${NC} $DB_SYNCHRONIZE"
echo -e "${YELLOW}Logging:${NC} $DB_LOGGING"
echo ""
echo -e "${BLUE}🔗 Connection URL:${NC}"
echo "postgresql://$DB_USERNAME:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo -e "${BLUE}📁 Environment file:${NC} /var/www/patongboxing/.env.database"
echo ""
echo -e "${YELLOW}🧪 Manual connection test:${NC}"
echo "psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_NAME"
echo ""
echo -e "${GREEN}✅ Ready for application deployment!${NC}"
