# Boxing Ticket Frontend VPS Setup Guide

## VPS Configuration
- **Server IP**: 43.229.133.51
- **Frontend Port**: 3000
- **Webhook Port**: 4100
- **API Backend**: 43.229.133.51:4000

## Prerequisites Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 4. Install Git
```bash
sudo apt install git -y
```

### 5. Install Nginx (Optional - for reverse proxy)
```bash
sudo apt install nginx -y
```

## Deployment Setup

### 1. Create Deployment Directory
```bash
sudo mkdir -p /var/www/boxing-ticket-frontend
sudo chown $USER:$USER /var/www/boxing-ticket-frontend
```

### 2. Clone Repository
```bash
cd /var/www/boxing-ticket-frontend
git clone https://github.com/your-username/boxing-ticket-frontend.git .
```

### 3. Install Dependencies
```bash
npm ci
```

### 4. Setup Environment
```bash
cp .env.production .env
```

### 5. Build Application
```bash
npm run build
```

### 6. Start with PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Webhook Setup

### 1. Start Webhook Handler
```bash
cd /var/www/boxing-ticket-frontend/deploy
chmod +x webhook-handler.sh
nohup ./webhook-handler.sh > webhook.log 2>&1 &
```

### 2. Test Webhook System
```bash
chmod +x test-webhook.sh
./test-webhook.sh
```

## Nginx Configuration (Optional)

Create `/etc/nginx/sites-available/boxing-ticket-frontend`:

```nginx
server {
    listen 80;
    server_name 43.229.133.51;

    # Frontend
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
    }

    # Webhook endpoint
    location /hooks/ {
        proxy_pass http://localhost:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/boxing-ticket-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 4000/tcp
sudo ufw allow 4100/tcp
sudo ufw enable
```

## Monitoring Commands

### Check PM2 Status
```bash
pm2 status
pm2 logs boxing-ticket-frontend
```

### Check Webhook Logs
```bash
tail -f /var/log/webhook-deploy.log
# or if using local log
tail -f /var/www/boxing-ticket-frontend/deploy/webhook-deploy.log
```

### Check Application Health
```bash
curl http://localhost:3000/api/health
curl http://43.229.133.51:3000/api/health
```

### Test Webhook
```bash
curl -X POST http://43.229.133.51:4100/hooks/deploy-frontend
```

## Automatic Deployment

Once setup is complete, you can trigger deployments by:

1. **GitHub Webhook**: Configure repository webhook to `http://43.229.133.51:4100/hooks/deploy-frontend`
2. **Manual Trigger**: `curl -X POST http://43.229.133.51:4100/hooks/deploy-frontend`
3. **Discord Notification**: Automatic notifications sent to Discord channel

## Environment Variables (.env.production)

```env
# Application
NODE_ENV=production
PORT=3000

# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://43.229.133.51:4000
NUXT_PUBLIC_SOCKET_URL=ws://43.229.133.51:4000/realtime

# Security
NUXT_SECRET_KEY=your-secret-key-here

# Optional: SSL in production
# NUXT_PUBLIC_API_BASE_URL=https://43.229.133.51:4000
# NUXT_PUBLIC_SOCKET_URL=wss://43.229.133.51:4000/realtime
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   sudo lsof -i :3000
   sudo kill -9 <PID>
   ```

2. **Permission Denied**
   ```bash
   sudo chown -R $USER:$USER /var/www/boxing-ticket-frontend
   ```

3. **Build Failures**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

4. **Socket Connection Issues**
   - Check backend server is running on port 4000
   - Verify CORS configuration in backend
   - Check firewall rules

### Health Check Endpoints

- Frontend: `http://43.229.133.51:3000/api/health`
- Backend: `http://43.229.133.51:4000/health`
- Webhook: `http://43.229.133.51:4100/hooks/deploy-frontend`

## Success Indicators

✅ PM2 shows application running
✅ Health check returns 200 OK
✅ Frontend accessible at http://43.229.133.51:3000
✅ Webhook handler running on port 4100
✅ Discord notifications working
✅ Socket.io connections working properly
