# 🥊 Patong Boxing Stadium - Fresh VPS Installation Guide

Complete step-by-step guide for deploying from scratch on a new VPS server.

## 📋 Prerequisites

- Fresh Ubuntu 20.04/22.04 VPS
- Root access
- Domain DNS pointed to VPS IP
- Minimum 2GB RAM, 20GB storage

## 🚀 Step-by-Step Installation

### Step 1: Initial System Setup

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git nano vim htop unzip software-properties-common \
    apt-transport-https ca-certificates gnupg lsb-release build-essential

# Set timezone
timedatectl set-timezone Asia/Bangkok
```

### Step 2: Install Node.js and NPM

```bash
# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 globally
npm install -g pm2
```

### Step 3: Install and Configure Nginx

```bash
# Install Nginx
apt install -y nginx

# Remove default configuration
rm -f /etc/nginx/sites-enabled/default

# Start and enable Nginx
systemctl enable nginx
systemctl start nginx
```

### Step 4: Install SSL Certificate Tools

```bash
# Install Certbot for SSL certificates
apt install -y certbot python3-certbot-nginx
```

### Step 5: Install PostgreSQL Database

```bash
# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql
```

### Step 6: Create System Users

```bash
# Create deploy user
useradd -m -s /bin/bash deploy
echo "deploy:DeployPassword123!" | chpasswd
usermod -aG sudo deploy

# Create project directories
mkdir -p /var/www/patongboxing
mkdir -p /var/log/patongboxing
mkdir -p /backup

# Set permissions
chown -R deploy:deploy /var/www/patongboxing
chown -R deploy:deploy /var/log/patongboxing
chmod 755 /var/www/patongboxing
```

### Step 7: Setup Database

```bash
# Switch to postgres user and create database
sudo -u postgres psql << 'EOF'
-- Drop existing database and user if they exist (for clean setup)
DROP DATABASE IF EXISTS patong_boxing_stadium;
DROP USER IF EXISTS boxing_user;

-- Create database
CREATE DATABASE patong_boxing_stadium;

-- Create user with specific password
CREATE USER boxing_user WITH PASSWORD 'Password123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE patong_boxing_stadium TO boxing_user;
ALTER USER boxing_user CREATEDB;

-- Connect to database
\c patong_boxing_stadium;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO boxing_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO boxing_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO boxing_user;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO boxing_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO boxing_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO boxing_user;

-- Display success message
SELECT 'Database created successfully!' AS status;

\q
EOF

# Test database connection
sudo -u postgres psql -h localhost -p 5432 -U boxing_user -d patong_boxing_stadium -c "SELECT 'Connection successful!' as status;"
```

### Step 8: Configure PostgreSQL for Remote Access

```bash
# Get PostgreSQL version and set paths
PG_VERSION=$(sudo -u postgres psql -t -c "SELECT version();" | grep -oP '\d+\.\d+' | head -1)
PG_MAJOR=$(echo $PG_VERSION | cut -d. -f1)
PG_CONFIG="/etc/postgresql/$PG_MAJOR/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_MAJOR/main/pg_hba.conf"

# Backup original configs
cp "$PG_CONFIG" "$PG_CONFIG.backup"
cp "$PG_HBA" "$PG_HBA.backup"

# Configure postgresql.conf for remote connections
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONFIG"
sed -i "s/#port = 5432/port = 5432/" "$PG_CONFIG"

# Add performance optimizations
cat >> "$PG_CONFIG" << 'PGCONF'

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
max_connections = 100
PGCONF

# Configure pg_hba.conf for authentication
cat >> "$PG_HBA" << 'PGHBA'

# Patong Boxing Stadium Database Access
host    patong_boxing_stadium    boxing_user    0.0.0.0/0    md5
host    all                      boxing_user    0.0.0.0/0    md5
local   patong_boxing_stadium    boxing_user                  md5
PGHBA

# Restart PostgreSQL
systemctl restart postgresql

# Verify PostgreSQL is running
systemctl status postgresql
```

### Step 8.1: Create Environment Configuration

```bash
# Create database environment file
cat > /var/www/patongboxing/.env.database << 'ENV'
# PostgreSQL Database Configuration for Patong Boxing Stadium
DATABASE_HOST=43.229.133.51
DATABASE_PORT=5432
DATABASE_USERNAME=boxing_user
DATABASE_PASSWORD=Password123!
DATABASE_NAME=patong_boxing_stadium
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# Connection URL
DATABASE_URL=postgresql://boxing_user:Password123!@43.229.133.51:5432/patong_boxing_stadium
ENV

# Set proper ownership
chown deploy:deploy /var/www/patongboxing/.env.database

# Test database connection
psql -h 43.229.133.51 -p 5432 -U boxing_user -d patong_boxing_stadium -c "SELECT 'Remote connection successful!' as status;"
```

### Step 9: Clone and Setup Application

```bash
# Switch to deploy user
su - deploy

# Navigate to web directory
cd /var/www

# Clone repository
git clone https://github.com/rsdgcxym007/boxing-ticket-frontend.git patongboxing

# Enter project directory
cd patongboxing

# Install dependencies
npm install

# Build application
npm run build

# Make scripts executable
chmod +x scripts/*.sh
chmod +x *.sh

# Exit back to root
exit
```

### Step 10: Configure Nginx Virtual Hosts

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/patongboxing << 'EOF'
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=frontend:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# Frontend - patongboxingstadiumticket.com
server {
    listen 80;
    listen [::]:80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Rate limiting
    limit_req zone=frontend burst=20 nodelay;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Backend API - api-patongboxingstadiumticket.com
server {
    listen 80;
    listen [::]:80;
    server_name api-patongboxingstadiumticket.com;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # CORS headers
    add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
    add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Rate limiting
    limit_req zone=api burst=5 nodelay;
    
    location / {
        # Handle preflight requests
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://patongboxingstadiumticket.com";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH";
            add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 86400;
            add_header Content-Type 'text/plain charset=UTF-8';
            add_header Content-Length 0;
            return 204;
        }
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
        proxy_send_timeout 86400;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/patongboxing /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 11: Setup Firewall (UFW)

```bash
# Reset UFW to defaults
ufw --force reset

# Set default policies
ufw default deny incoming
ufw default allow outgoing

# Allow essential services
ufw allow ssh
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 5432/tcp  # PostgreSQL

# Enable firewall
ufw --force enable

# Check status
ufw status verbose
```

### Step 12: Setup Fail2Ban Security

```bash
# Install Fail2Ban
apt install -y fail2ban

# Create custom configuration
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3
backend = auto

[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-req-limit]
enabled = true
filter = nginx-req-limit
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

# Start and enable Fail2Ban
systemctl enable fail2ban
systemctl start fail2ban
```

### Step 13: Start Application with PM2

```bash
# Switch to deploy user
su - deploy

# Navigate to project
cd /var/www/patongboxing

# Start application with PM2
pm2 start ecosystem.config.cjs --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup

# Copy and run the generated command as root (PM2 will show the command)
exit

# Run the startup command shown by PM2 (as root)
# Example: env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### Step 14: Install SSL Certificates

```bash
# Install SSL certificates for all domains
certbot --nginx \
  -d patongboxingstadiumticket.com \
  -d www.patongboxingstadiumticket.com \
  -d api-patongboxingstadiumticket.com \
  --non-interactive \
  --agree-tos \
  --email info@patongboxing.com \
  --redirect

# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test auto-renewal
certbot renew --dry-run
```

### Step 15: Setup System Monitoring

```bash
# Configure log rotation
cat > /etc/logrotate.d/patongboxing << 'EOF'
/var/log/patongboxing/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
EOF

# Setup automatic updates
cat > /etc/apt/apt.conf.d/20auto-upgrades << 'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF

apt install -y unattended-upgrades
```

### Step 16: Create Backup Script

```bash
# Create backup script
cat > /usr/local/bin/backup-patongboxing.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

echo "Starting backup: $DATE"

# Backup application
tar -czf $BACKUP_DIR/patongboxing-app-$DATE.tar.gz /var/www/patongboxing

# Backup database
sudo -u postgres pg_dump patong_boxing_stadium | gzip > $BACKUP_DIR/patongboxing-db-$DATE.sql.gz

# Backup nginx config
tar -czf $BACKUP_DIR/nginx-config-$DATE.tar.gz /etc/nginx

# Backup SSL certificates
tar -czf $BACKUP_DIR/ssl-certs-$DATE.tar.gz /etc/letsencrypt

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-patongboxing.sh

# Add to crontab (daily backup at 2 AM)
echo "0 2 * * * /usr/local/bin/backup-patongboxing.sh" | crontab -
```

## ✅ Final Verification

### Check All Services

```bash
# Check system services
systemctl status nginx
systemctl status postgresql
systemctl status fail2ban
systemctl status certbot.timer

# Check PM2 (as deploy user)
su - deploy -c "pm2 status"

# Check firewall
ufw status

# Check fail2ban
fail2ban-client status
```

### Test Application

```bash
# Test HTTP redirects to HTTPS
curl -I http://patongboxingstadiumticket.com
curl -I http://api-patongboxingstadiumticket.com

# Test HTTPS
curl -I https://patongboxingstadiumticket.com
curl -I https://api-patongboxingstadiumticket.com

# Test SSL certificates
openssl s_client -connect patongboxingstadiumticket.com:443 -servername patongboxingstadiumticket.com
```

### Check Database Connection

```bash
# Test local database connection
psql -h localhost -p 5432 -U boxing_user -d patong_boxing_stadium -c "SELECT 'Local database connection successful!' as status;"

# Test remote database connection (using VPS IP)
psql -h 43.229.133.51 -p 5432 -U boxing_user -d patong_boxing_stadium -c "SELECT 'Remote database connection successful!' as status;"

# Alternative connection test using URL
psql "postgresql://boxing_user:Password123!@43.229.133.51:5432/patong_boxing_stadium" -c "SELECT current_database(), current_user, version();"

# Verify database configuration
echo "Database environment variables:"
cat /var/www/patongboxing/.env.database
```

## 🎉 Deployment Complete!

Your Patong Boxing Stadium application is now live at:

- **Frontend**: https://patongboxingstadiumticket.com
- **Backend API**: https://api-patongboxingstadiumticket.com

## 📊 System Information

### Database Configuration
```
Host: 43.229.133.51
Port: 5432
Database: patong_boxing_stadium
Username: boxing_user
Password: Password123!

# Environment Variables
DATABASE_HOST=43.229.133.51
DATABASE_PORT=5432
DATABASE_USERNAME=boxing_user
DATABASE_PASSWORD=Password123!
DATABASE_NAME=patong_boxing_stadium
DATABASE_SSL=false
DATABASE_SYNCHRONIZE=false
DATABASE_LOGGING=false

# Connection URL
DATABASE_URL=postgresql://boxing_user:Password123!@43.229.133.51:5432/patong_boxing_stadium
```

### Application Paths
```
Application: /var/www/patongboxing
Logs: /var/log/patongboxing
Backups: /backup
```

### Security Features
- ✅ SSL/TLS certificates with auto-renewal
- ✅ Firewall (UFW) configured
- ✅ Fail2Ban intrusion prevention
- ✅ Rate limiting on web server
- ✅ Security headers enabled
- ✅ Daily automated backups

### Management Commands

```bash
# PM2 Management
su - deploy -c "pm2 status"
su - deploy -c "pm2 restart patong-boxing-stadium"
su - deploy -c "pm2 logs"

# Service Management
systemctl status nginx
systemctl restart nginx
systemctl status postgresql

# SSL Management
certbot certificates
certbot renew

# Security
fail2ban-client status
ufw status

# Backups
/usr/local/bin/backup-patongboxing.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Application not starting**: Check PM2 logs: `pm2 logs`
2. **SSL issues**: Verify DNS propagation and retry: `certbot --nginx`
3. **Database connection issues**: Check PostgreSQL status and configuration
4. **Permission issues**: Ensure deploy user owns application files

### Log Locations

```bash
# Application logs
/var/log/patongboxing/

# PM2 logs
~/.pm2/logs/

# Nginx logs
/var/log/nginx/

# System logs
/var/log/syslog
/var/log/auth.log
```

**🥊 Your Patong Boxing Stadium application is now ready for production!**
