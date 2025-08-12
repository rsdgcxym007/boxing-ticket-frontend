# 🎯 Quick Reference - Port Configuration

## Current Architecture (Updated)

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Main App** | 3000 | `http://43.229.133.51:3000` | Nuxt frontend application |
| **API** | 4000 | `http://43.229.133.51:4000` | Backend API server |
| **Webhook** | 4200 | `http://43.229.133.51:4200/hooks/deploy-frontend` | External webhook server |

## Quick Commands

```bash
# Setup webhook server (first time)
./deploy.sh setup-webhook

# Start webhook service  
sudo systemctl start boxing-webhook

# Test webhook
./deploy.sh test

# Deploy application
./deploy.sh deploy

# Check status
sudo systemctl status boxing-webhook
pm2 status boxing-ticket-frontend
```

## GitHub Webhook URL

Configure GitHub webhook with:
**URL**: `http://43.229.133.51:4200/hooks/deploy-frontend`

## Service Management

```bash
# Start services
sudo systemctl start boxing-webhook    # Webhook server (port 4200)
pm2 start ecosystem.config.cjs         # Main app (port 3000)

# Check logs
sudo journalctl -u boxing-webhook -f   # Webhook logs
pm2 logs boxing-ticket-frontend        # App logs
tail -f /var/log/frontend/webhook.log  # Webhook file logs
```

## Health Checks

```bash
# Main app health
curl http://localhost:3000/health

# Webhook server health  
curl http://localhost:4200/hooks/deploy-frontend

# Test webhook trigger
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/featues/v1","repository":{"name":"boxing-ticket-frontend"}}' \
  http://43.229.133.51:4200/hooks/deploy-frontend
```

## File Locations

- **Main app**: `/var/www/frontend/boxing-ticket-frontend/`
- **Webhook config**: `/var/www/frontend/boxing-ticket-frontend/webhook-config.json`
- **Logs**: `/var/log/frontend/`
- **Systemd service**: `/etc/systemd/system/boxing-webhook.service`
