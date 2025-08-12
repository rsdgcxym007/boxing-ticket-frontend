# 🚀 Quick VPS Deployment Guide

## Syntax Error Fixed!
✅ Fixed syntax errors in deploy.sh
✅ Ready for VPS deployment

## Quick Commands

### 1. Sync Files to VPS
```bash
# Sync deployment files only
./sync-to-vps.sh sync

# Sync all project files
./sync-to-vps.sh all

# Check VPS connection
./sync-to-vps.sh check
```

### 2. Deploy on VPS
```bash
# SSH to VPS and deploy
ssh root@43.229.133.51
cd /var/www/frontend/boxing-ticket-frontend
./deploy.sh deploy
```

### 3. Monitor Deployment
```bash
# Local: Monitor VPS logs
./sync-to-vps.sh logs

# VPS: Watch logs real-time
ssh root@43.229.133.51
cd /var/www/frontend/boxing-ticket-frontend
./watch-logs.sh live
```

### 4. Check Status
```bash
# Local: Check VPS status
./sync-to-vps.sh status

# VPS: Check application
ssh root@43.229.133.51
cd /var/www/frontend/boxing-ticket-frontend
./deploy.sh status
./deploy.sh health
```

## Fixed Issues

### ✅ Syntax Errors Fixed:
1. **Line 818**: Removed extra `}` in install_dependencies function
2. **Line 1003**: Removed extra `}` in manage_pm2 function  
3. **Line 32**: Fixed mixed echo/assignment statement

### ✅ Files Ready for VPS:
- `deploy.sh` - Main deployment script with enhanced logging
- `sync-to-vps.sh` - File sync utility
- `watch-logs.sh` - Log monitoring tool
- `webhook-config.json` - Webhook configuration
- `start-webhook-server.sh` - Webhook server startup
- All other configuration files

## One-Command Deployment

```bash
# 1. Sync files to VPS
./sync-to-vps.sh sync

# 2. Deploy on VPS (run this on VPS or via SSH)
ssh root@43.229.133.51 "cd /var/www/frontend/boxing-ticket-frontend && ./deploy.sh deploy"

# 3. Monitor (optional)
./sync-to-vps.sh status
```

## Webhook Setup on VPS

```bash
# After files are synced, setup webhook server
ssh root@43.229.133.51
cd /var/www/frontend/boxing-ticket-frontend

# Setup webhook server
./deploy.sh setup-webhook

# Start webhook service
sudo systemctl start boxing-webhook

# Check status
sudo systemctl status boxing-webhook
```

## GitHub Webhook URL
After VPS deployment is successful, set GitHub webhook to:
**URL**: `http://43.229.133.51:4200/hooks/deploy-frontend`

## Troubleshooting

### If deployment fails:
```bash
# Check logs on VPS
ssh root@43.229.133.51
cd /var/www/frontend/boxing-ticket-frontend
./watch-logs.sh errors
./watch-logs.sh last
```

### If webhook fails:
```bash
# Check webhook logs
ssh root@43.229.133.51
sudo journalctl -u boxing-webhook -f
```

Ready to deploy! 🎯
