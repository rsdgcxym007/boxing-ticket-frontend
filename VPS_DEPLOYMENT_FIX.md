# VPS Deployment Fix Guide

## Issues Identified
Your VPS is experiencing these problems:
1. **500 Server Errors** for JavaScript and CSS assets
2. **Incorrect MIME Types** for CSS files (served as text/html instead of text/css)
3. **Missing Static Assets** like images and logos

## Root Causes
1. **Server Configuration**: Missing proper static file handling
2. **Reverse Proxy Issues**: If using nginx/apache, incorrect proxy setup
3. **Asset Path Problems**: Incorrect static asset serving configuration
4. **Process Management**: Application not running with proper environment

## Solutions Applied

### 1. Updated Nuxt Configuration
- Added proper route rules for static assets with correct MIME types
- Added asset compression and caching headers
- Fixed favicon reference to use standard favicon.ico

### 2. Created Server Middleware
- Added `server/middleware/assets.ts` to handle MIME types correctly
- Ensures CSS files are served with `text/css; charset=utf-8`
- Handles all static asset types properly

### 3. PM2 Configuration
- Created `ecosystem.config.js` for proper process management
- Configured for cluster mode with automatic restarts
- Added logging and memory management

### 4. Deployment Scripts
- Added `deploy.sh` for automated deployment
- Includes build, PM2 setup, and error handling
- Added npm scripts for easy management

## VPS Deployment Steps

### Step 1: Upload and Build
```bash
# On your VPS
cd /path/to/your/project
npm ci
npm run build
```

### Step 2: Start with PM2
```bash
# Install PM2 if not installed
npm install -g pm2

# Start the application
npm run pm2:start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 3: Verify Running
```bash
# Check status
npm run pm2:status

# Check logs
npm run pm2:logs

# Test locally
curl -I http://localhost:3000
```

## Nginx Configuration (If Using Reverse Proxy)

Create or update `/etc/nginx/sites-available/your-site`:

```nginx
server {
    listen 80;
    server_name your-domain.com 43.229.133.51;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static assets with proper MIME types
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Add proper headers
        add_header Cache-Control "public, max-age=31536000";
        
        # Ensure CSS files have correct MIME type
        location ~* \.css$ {
            add_header Content-Type "text/css; charset=utf-8";
            proxy_pass http://localhost:3000;
        }
        
        # Ensure JS files have correct MIME type
        location ~* \.js$ {
            add_header Content-Type "application/javascript; charset=utf-8";
            proxy_pass http://localhost:3000;
        }
    }
}
```

## Apache Configuration (Alternative)

If using Apache, add to your VirtualHost:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias 43.229.133.51

    ProxyPreserveHost On
    ProxyRequests Off
    
    # Main application
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Ensure proper MIME types
    <LocationMatch "\.(css)$">
        Header set Content-Type "text/css; charset=utf-8"
    </LocationMatch>
    
    <LocationMatch "\.(js)$">
        Header set Content-Type "application/javascript; charset=utf-8"
    </LocationMatch>

    # Caching for static assets
    <LocationMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000"
    </LocationMatch>
</VirtualHost>
```

## Troubleshooting Commands

```bash
# Check if app is running
pm2 status

# View real-time logs
pm2 logs boxing-ticket-frontend --lines 50

# Restart application
pm2 restart boxing-ticket-frontend

# Check port usage
netstat -tlnp | grep :3000

# Test MIME types
curl -I http://localhost:3000/_nuxt/entry.-cvR0kyN.css

# Check file permissions
ls -la .output/public/

# Test static file serving
curl -I http://localhost:3000/images/logo/LOGOFC.svg
```

## Environment Variables

Create `.env` file:

```bash
NODE_ENV=production
PORT=3000
NITRO_HOST=0.0.0.0
NITRO_PORT=3000
NUXT_PUBLIC_API_BASE=http://43.229.133.51:4000/api
NUXT_PUBLIC_SOCKET_URL=http://43.229.133.51:4000
```

## Quick Fix Commands

```bash
# Stop all PM2 processes
pm2 delete all

# Clean build and restart
rm -rf .nuxt .output node_modules
npm ci
npm run build
npm run pm2:start

# If still having issues, check nginx/apache
sudo nginx -t
sudo systemctl restart nginx

# Or for Apache
sudo apachectl configtest
sudo systemctl restart apache2
```

The configuration changes I made should resolve the MIME type issues and 500 errors. The key improvements are:

1. **Proper static asset handling** in nuxt.config.ts
2. **Server middleware** for MIME type enforcement
3. **PM2 configuration** for stable process management
4. **Deployment scripts** for easier management

After applying these changes, rebuild and restart your application on the VPS.
