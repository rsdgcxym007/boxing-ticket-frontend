#!/bin/bash

# 🗄️ PostgreSQL Database Setup for Patong Boxing Stadium
# This script creates the database, user, and configures PostgreSQL

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Database configuration
DB_NAME="patong_boxing_stadium"
DB_USER="boxing_user"
DB_PASSWORD="Password123!"
DB_HOST="43.229.133.51"
DB_PORT="5432"

echo -e "${BLUE}🗄️  PostgreSQL Database Setup - Patong Boxing Stadium${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ This script must be run as root${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    apt update
    apt install -y postgresql postgresql-contrib
    echo -e "${GREEN}✅ PostgreSQL installed${NC}"
else
    echo -e "${GREEN}✅ PostgreSQL already installed${NC}"
fi

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

echo -e "${YELLOW}🔧 Creating database and user...${NC}"

# Create database and user
sudo -u postgres psql << EOF
-- Drop database and user if they exist (for clean setup)
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- Create database
CREATE DATABASE $DB_NAME;

-- Create user with password
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER USER $DB_USER CREATEDB;

-- Connect to the database
\c $DB_NAME;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO $DB_USER;

-- Display success message
SELECT 'Database and user created successfully!' AS status;
EOF

echo -e "${GREEN}✅ Database and user created${NC}"

echo -e "${YELLOW}⚙️  Configuring PostgreSQL for remote connections...${NC}"

# Get PostgreSQL version
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
PG_MAJOR=$(echo $PG_VERSION | cut -d. -f1)

# Set config paths
PG_CONFIG_DIR="/etc/postgresql/$PG_MAJOR/main"
PG_CONF="$PG_CONFIG_DIR/postgresql.conf"
PG_HBA="$PG_CONFIG_DIR/pg_hba.conf"

# Backup original configs
cp "$PG_CONF" "$PG_CONF.backup"
cp "$PG_HBA" "$PG_HBA.backup"

# Configure postgresql.conf
echo -e "${BLUE}Updating postgresql.conf...${NC}"
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
sed -i "s/#port = 5432/port = 5432/" "$PG_CONF"

# Add optimized settings
cat >> "$PG_CONF" << 'PGCONF'

# Patong Boxing Stadium - Performance Settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB

# Connection settings
max_connections = 100
PGCONF

# Configure pg_hba.conf
echo -e "${BLUE}Updating pg_hba.conf...${NC}"

# Add our database connection rules
cat >> "$PG_HBA" << PGHBA

# Patong Boxing Stadium Database Access
host    $DB_NAME    $DB_USER    0.0.0.0/0    md5
host    all         $DB_USER    0.0.0.0/0    md5

# Local connections
local   $DB_NAME    $DB_USER                  md5
PGHBA

echo -e "${YELLOW}🔥 Restarting PostgreSQL...${NC}"

# Restart PostgreSQL
systemctl restart postgresql

# Check if PostgreSQL is running
if systemctl is-active --quiet postgresql; then
    echo -e "${GREEN}✅ PostgreSQL restarted successfully${NC}"
else
    echo -e "${RED}❌ PostgreSQL failed to restart${NC}"
    exit 1
fi

echo -e "${YELLOW}🔓 Configuring firewall...${NC}"

# Open PostgreSQL port in firewall
ufw allow 5432/tcp
echo -e "${GREEN}✅ Port 5432 opened in firewall${NC}"

echo -e "${YELLOW}🧪 Testing database connection...${NC}"

# Test local connection
if sudo -u postgres psql -h localhost -p 5432 -U $DB_USER -d $DB_NAME -c "SELECT 'Connection successful!' as status;" 2>/dev/null; then
    echo -e "${GREEN}✅ Local connection test passed${NC}"
else
    echo -e "${RED}❌ Local connection test failed${NC}"
fi

# Create .env configuration file
echo -e "${YELLOW}📝 Creating environment configuration...${NC}"

cat > /var/www/patongboxing/.env.database << ENV
# PostgreSQL Database Configuration
DATABASE_HOST=$DB_HOST
DATABASE_PORT=$DB_PORT
DATABASE_USERNAME=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_NAME=$DB_NAME
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# Connection URL
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME
ENV

chown deploy:deploy /var/www/patongboxing/.env.database

echo ""
echo -e "${GREEN}🎉 PostgreSQL Database Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Database Information:${NC}"
echo -e "${YELLOW}Host:${NC} $DB_HOST"
echo -e "${YELLOW}Port:${NC} $DB_PORT"
echo -e "${YELLOW}Database:${NC} $DB_NAME"
echo -e "${YELLOW}Username:${NC} $DB_USER"
echo -e "${YELLOW}Password:${NC} $DB_PASSWORD"
echo ""
echo -e "${BLUE}🔗 Connection String:${NC}"
echo "postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo -e "${BLUE}📁 Environment file created:${NC} /var/www/patongboxing/.env.database"
echo ""
echo -e "${YELLOW}🧪 Test connection:${NC}"
echo "psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""
echo -e "${GREEN}✅ Ready for backend deployment!${NC}"
