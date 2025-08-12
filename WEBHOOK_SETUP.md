# 🎣 Webhook Server Setup Guide

This guide explains how to set up the external webhook server on port 4100 using `adnanh/webhook`.

## Architecture

- **Main App**: `http://43.229.133.51:3000` (Nuxt frontend)
- **API**: `http://43.229.133.51:4000` (Backend API)
- **Webhook**: `http://43.229.133.51:4200/hooks/deploy-frontend` (External webhook server)

## Setup Instructions

### 1. Setup Webhook Server

```bash
# Setup webhook server (installs webhook binary, systemd service)
./deploy.sh setup-webhook
```

### 2. Start Webhook Service

```bash
# Start the webhook service
sudo systemctl start boxing-webhook

# Check status
sudo systemctl status boxing-webhook

# View logs
sudo journalctl -u boxing-webhook -f
```

### 3. Test Webhook

```bash
# Test webhook endpoint
./deploy.sh test

# Or manually test
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/featues/v1","repository":{"name":"boxing-ticket-frontend"}}' \
  http://43.229.133.51:4200/hooks/deploy-frontend
```

## GitHub Webhook Configuration

In your GitHub repository settings:

1. Go to **Settings** → **Webhooks** → **Add webhook**
2. **Payload URL**: `http://43.229.133.51:4200/hooks/deploy-frontend`
3. **Content type**: `application/json`
4. **Which events**: `Just the push event`
5. **Active**: ✅ Checked

## Webhook Configuration

The webhook is configured in `webhook-config.json`:

```json
{
  "id": "deploy-frontend",
  "execute-command": "/var/www/frontend/boxing-ticket-frontend/deploy.sh",
  "command-working-directory": "/var/www/frontend/boxing-ticket-frontend",
  "response-message": "🚀 Deploying frontend...",
  "trigger-rule": {
    "match": {
      "type": "regex", 
      "value": "^refs/heads/(featues/v1|master|main)$",
      "parameter": {
        "source": "payload",
        "name": "ref"
      }
    }
  }
}
```

## Branch Matching

The webhook triggers deployment for these branches:
- `featues/v1` (current development branch)
- `master` 
- `main`

To change branches, edit `webhook-config.json` and restart the service:

```bash
sudo systemctl restart boxing-webhook
```

## Troubleshooting

### Check Webhook Server Status
```bash
sudo systemctl status boxing-webhook
sudo journalctl -u boxing-webhook -f
```

### Check Port 4200
```bash
netstat -tulpn | grep :4200
curl http://localhost:4200/hooks/deploy-frontend
```

### Manual Webhook Start
```bash
cd /var/www/frontend/boxing-ticket-frontend
./start-webhook-server.sh
```

### Webhook Logs
```bash
tail -f /var/log/frontend/webhook.log
```

## Files

- `webhook-config.json` - Webhook configuration
- `start-webhook-server.sh` - Webhook server startup script  
- `boxing-webhook.service` - Systemd service file
- `deploy.sh` - Main deployment script (accepts webhook arguments)

## Security Notes

- The webhook server runs with limited privileges
- Only specific paths are writable
- The service auto-restarts on failure
- Logs are written to `/var/log/frontend/webhook.log`
