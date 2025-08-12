# 🖥️ VPS Setup Instructions for Boxing Ticket Frontend

## Server Information
- **IP**: 43.229.133.51
- **Webhook URL**: http://43.229.133.51:4100/hooks/deploy-frontend
- **Discord Webhook**: https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l

## 📋 Step-by-Step VPS Setup

### 1. Server Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git build-essential

# Install Node.js 18 (using NodeSource repository)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should be 18.x
npm --version   # Should be 9.x or higher

# Install PM2 globally
sudo npm install -g pm2

# Install additional tools
sudo apt install -y nginx ufw jq bc
```

### 2. User and Directory Setup

```bash
# Create deployment user (optional but recommended)
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# Create application directory
sudo mkdir -p /var/www/boxing-ticket-frontend
sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend

# Create logs directory
sudo mkdir -p /var/log/boxing-ticket
sudo chown -R $USER:$USER /var/log/boxing-ticket

# Create backup directory
sudo mkdir -p /var/backups
sudo chown -R $USER:$USER /var/backups
```

### 3. Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone the repository (replace with your actual repo URL)
git clone https://github.com/your-username/boxing-ticket-frontend.git
cd boxing-ticket-frontend

# Set up permissions
sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend
chmod +x deploy.sh
chmod +x webhook-handler.sh

# Create logs directory
mkdir -p logs
```

### 4. Environment Configuration

```bash
# Copy production environment
cp .env.production .env

# Edit environment variables if needed
nano .env

# Make sure these are set:
# NUXT_PUBLIC_API_BASE=http://43.229.133.51:4000
# NUXT_PUBLIC_SOCKET_URL=http://43.229.133.51:4000
# NUXT_PUBLIC_WS_URL=ws://43.229.133.51:4000/realtime
```

### 5. Initial Deployment

```bash
# Run initial deployment
./deploy.sh deploy

# Check PM2 status
pm2 status

# Save PM2 configuration
pm2 save
pm2 startup

# Follow the instructions to enable PM2 on system boot
```

### 6. Nginx Configuration

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/boxing-ticket-frontend
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name 43.229.133.51;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
        root /var/www/boxing-ticket-frontend/.output/public;
        try_files $uri =404;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:3000/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable the site:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/boxing-ticket-frontend /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. Webhook Server Setup

For webhook functionality, you'll need a webhook server running on port 4100. Here's a simple setup:

```bash
# Create webhook server directory
sudo mkdir -p /var/www/webhook-server
cd /var/www/webhook-server

# Create simple webhook server
cat > webhook-server.js << 'EOF'
const http = require('http');
const { exec } = require('child_process');
const url = require('url');

const PORT = 4100;
const WEBHOOK_PATH = '/hooks/deploy-frontend';

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'POST' && parsedUrl.pathname === WEBHOOK_PATH) {
        console.log(`[${new Date().toISOString()}] Webhook triggered`);
        
        // Execute deployment script
        exec('/var/www/boxing-ticket-frontend/webhook-handler.sh deploy', (error, stdout, stderr) => {
            if (error) {
                console.error('Deployment error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Deployment failed', details: error.message }));
                return;
            }
            
            console.log('Deployment output:', stdout);
            if (stderr) console.error('Deployment stderr:', stderr);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Deployment triggered successfully' }));
        });
        
        return;
    }
    
    // Health check
    if (req.method === 'GET' && parsedUrl.pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
            status: 'healthy', 
            timestamp: new Date().toISOString(),
            service: 'webhook-server' 
        }));
        return;
    }
    
    // 404 for other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Webhook server running on port ${PORT}`);
    console.log(`Webhook URL: http://43.229.133.51:${PORT}${WEBHOOK_PATH}`);
});
EOF

# Create PM2 configuration for webhook server
cat > ecosystem.webhook.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'webhook-server',
    script: 'webhook-server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '100M',
    env: {
      NODE_ENV: 'production',
      PORT: 4100
    },
    log_file: '/var/log/boxing-ticket/webhook.log',
    out_file: '/var/log/boxing-ticket/webhook-out.log',
    error_file: '/var/log/boxing-ticket/webhook-error.log',
    time: true
  }]
};
EOF

# Start webhook server
pm2 start ecosystem.webhook.config.js
pm2 save
```

### 8. Firewall Configuration

```bash
# Configure UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow Node.js application port
sudo ufw allow 3000

# Allow webhook server port
sudo ufw allow 4100

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 9. SSL Certificate (Optional but Recommended)

```bash
# Install Certbot for Let's Encrypt
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 10. Monitoring and Logs

```bash
# Setup log rotation
sudo nano /etc/logrotate.d/boxing-ticket

# Add this content:
/var/log/boxing-ticket/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}

# Test log rotation
sudo logrotate -d /etc/logrotate.d/boxing-ticket
```

### 11. Health Check Cron Job

```bash
# Create health check script
cat > /var/www/boxing-ticket-frontend/health-monitor.sh << 'EOF'
#!/bin/bash

HEALTH_URL="http://localhost:3000/health"
LOG_FILE="/var/log/boxing-ticket/health-monitor.log"

# Check application health
if ! curl -s "$HEALTH_URL" > /dev/null; then
    echo "[$(date)] Health check failed - restarting application" >> "$LOG_FILE"
    pm2 restart boxing-ticket-frontend
    
    # Send Discord notification
    curl -H "Content-Type: application/json" \
         -X POST \
         -d '{"content": "🚨 **Boxing Ticket Frontend** - Health check failed, application restarted automatically"}' \
         "https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXvFjcfSQKXNl9Xdj60ks__l"
fi
EOF

chmod +x /var/www/boxing-ticket-frontend/health-monitor.sh

# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /var/www/boxing-ticket-frontend/health-monitor.sh") | crontab -
```

## 🚀 Deployment Commands

### Manual Deployment
```bash
cd /var/www/boxing-ticket-frontend
./deploy.sh deploy
```

### Webhook Deployment
```bash
# Test webhook
curl -X POST http://43.229.133.51:4100/hooks/deploy-frontend

# Or trigger from GitHub/GitLab webhooks
```

### Check Status
```bash
# Application status
pm2 status

# View logs
pm2 logs boxing-ticket-frontend

# Health check
curl http://43.229.133.51:3000/health
```

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission issues**
   ```bash
   sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend
   ```

3. **Nginx not starting**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

4. **PM2 not starting on boot**
   ```bash
   pm2 startup
   pm2 save
   ```

### Monitoring Commands

```bash
# System resources
htop
df -h
free -h

# Application logs
tail -f /var/log/boxing-ticket/*.log
pm2 monit

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support and Maintenance

### Daily Maintenance
- Check PM2 status: `pm2 status`
- Check logs: `pm2 logs --lines 50`
- Monitor disk space: `df -h`

### Weekly Maintenance
- Update system packages: `sudo apt update && sudo apt upgrade`
- Restart application: `pm2 restart all`
- Check SSL certificate expiry: `sudo certbot certificates`

### Monthly Maintenance
- Clean old backups: `sudo find /var/backups -name "boxing-ticket-*" -mtime +30 -delete`
- Rotate logs manually: `sudo logrotate -f /etc/logrotate.d/boxing-ticket`
- Update Node.js if needed

## 🎯 Success Checklist

- [ ] ✅ Node.js 18+ installed
- [ ] ✅ PM2 installed and configured
- [ ] ✅ Application deployed and running
- [ ] ✅ Nginx configured and serving
- [ ] ✅ Webhook server running on port 4100
- [ ] ✅ Firewall configured
- [ ] ✅ Health monitoring active
- [ ] ✅ Discord notifications working
- [ ] ✅ Logs rotation configured
- [ ] ✅ SSL certificate installed (optional)

---

**VPS Setup Complete! 🎉**

Your Boxing Ticket Frontend is now ready for production use with automatic deployment via webhooks and Discord notifications.
