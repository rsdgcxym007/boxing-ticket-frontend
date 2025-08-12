# 🚀 Boxing Ticket Frontend - VPS Deployment

Automated deployment system for the Boxing Ticket Frontend on VPS.

## 📁 Directory Structure

```
/var/www/frontend/boxing-ticket-frontend/  # Main application directory
/var/backups/frontend/                     # Backup storage
/var/log/frontend/                         # Application logs
```

## 🛠️ Setup Instructions

### 1. Initial VPS Setup

Run the setup script to create directories and configure the environment:

```bash
# Make executable
chmod +x deploy/setup-vps.sh

# Run setup (creates directories, clones repo, sets permissions)
bash deploy/setup-vps.sh
```

### 2. Manual Deployment

```bash
# Navigate to project directory
cd /var/www/frontend/boxing-ticket-frontend

# Make deploy script executable
chmod +x deploy.sh

# Run deployment
bash deploy.sh
```

### 3. Webhook Setup

Enable automatic deployment via GitHub webhooks:

```bash
# Make webhook handler executable
chmod +x deploy/webhook-handler.sh

# Start webhook service
sudo systemctl start boxing-webhook
sudo systemctl enable boxing-webhook

# Check status
sudo systemctl status boxing-webhook
```

### 4. Test Webhook

```bash
# Make test script executable
chmod +x deploy/test-webhook.sh

# Run webhook test
bash deploy/test-webhook.sh
```

## 🔧 Configuration

### Environment Variables

Update `/var/www/frontend/boxing-ticket-frontend/.env.production`:

```bash
NODE_ENV=production
NUXT_APP_BASE_URL=http://43.229.133.51:3000
NUXT_PUBLIC_API_BASE=http://43.229.133.51:8000/api
```

### PM2 Configuration

The application uses PM2 with cluster mode. Configuration in `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'boxing-ticket-frontend',
    port: '3000',
    exec_mode: 'cluster',
    instances: 'max',
    script: './.output/server/index.mjs'
  }]
}
```

## 📝 Available Commands

| Command | Description |
|---------|-------------|
| `bash deploy.sh` | Full deployment process |
| `bash deploy.sh status` | Show application status |
| `bash deploy.sh logs` | Show application logs |
| `bash deploy.sh restart` | Restart application |
| `bash deploy.sh health` | Health check |
| `bash deploy.sh backup` | Manual backup |

## 🌐 Webhook Endpoints

- **Deployment**: `http://43.229.133.51:4100/hooks/deploy-frontend`
- **Method**: POST
- **GitHub**: Add this URL to your repository webhooks

## 📊 Monitoring

### PM2 Status
```bash
pm2 status
pm2 logs boxing-ticket-frontend
pm2 monit
```

### Application URLs
- **Frontend**: http://43.229.133.51:3000
- **Health Check**: http://43.229.133.51:3000/health
- **API Health**: http://43.229.133.51:3000/api/health

### Logs
- **Application**: `/var/log/frontend/`
- **Webhook**: `/var/log/webhook-deploy.log`
- **PM2**: `~/.pm2/logs/`

## 🔒 Security

### Firewall Rules
```bash
# Open required ports
sudo ufw allow 3000/tcp  # Frontend application
sudo ufw allow 4100/tcp  # Webhook handler
```

### File Permissions
- Application files: `755`
- Log files: `644`
- Scripts: `755`

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   sudo lsof -i :3000
   pm2 kill
   ```

2. **Permission denied**
   ```bash
   sudo chown -R $USER:$USER /var/www/frontend/
   chmod -R 755 /var/www/frontend/
   ```

3. **Build failures**
   ```bash
   rm -rf node_modules .nuxt .output
   npm install
   npm run build
   ```

4. **Webhook not working**
   ```bash
   sudo systemctl restart boxing-webhook
   sudo systemctl status boxing-webhook
   ```

### Log Locations
- **Deployment**: `/var/log/webhook-deploy.log`
- **Application**: `/var/log/frontend/combined.log`
- **Errors**: `/var/log/frontend/error.log`

## 📞 Support

For issues or questions:
1. Check application logs
2. Verify PM2 status
3. Test webhook endpoints
4. Review Discord notifications

## 🔄 Backup & Recovery

### Automatic Backups
- Created before each deployment
- Stored in `/var/backups/frontend/`
- Retention: 5 latest backups

### Manual Backup
```bash
bash deploy.sh backup
```

### Recovery
```bash
# Stop application
pm2 stop boxing-ticket-frontend

# Restore from backup
sudo cp -r /var/backups/frontend/boxing-ticket-frontend-YYYYMMDD-HHMMSS/* /var/www/frontend/boxing-ticket-frontend/

# Restart application
pm2 restart boxing-ticket-frontend
```
