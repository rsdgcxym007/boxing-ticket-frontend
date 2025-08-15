# 🥊 Patong Boxing Stadium - Deployment Guide

## 🌐 **Domain Configuration**

- **Frontend**: `patongboxingstadiumticket.com`
- **Backend API**: `api-patongboxingstadiumticket.com`
- **VPS**: `43.229.133.51`

## 📦 **Available Scripts**

### 🚀 **Deployment Scripts**

```bash
# Full deployment (Frontend + Backend + Domain setup)
npm run deploy:full

# Frontend only
npm run deploy:frontend  

# Backend only
npm run deploy:backend

# Domain setup (DNS, SSL, Nginx)
npm run setup:domain
```

### 🔧 **Management Scripts**

```bash
# PM2 Management
npm run pm2:start      # Start application
npm run pm2:stop       # Stop application  
npm run pm2:restart    # Restart application
npm run pm2:status     # Check status
npm run pm2:logs       # View logs
npm run pm2:cleanup    # Clean duplicate processes

# Monitoring
npm run health-check   # Health check both domains
npm run logs:watch     # Watch deployment logs
```

## 🎯 **Quick Start**

### 1. **Initial Setup**
```bash
# Setup domains and SSL
npm run setup:domain

# Deploy everything
npm run deploy:full
```

### 2. **Development Workflow**
```bash
# Frontend changes
npm run deploy:frontend

# Backend changes  
npm run deploy:backend

# Health check
npm run health-check
```

## 🏗️ **Architecture**

```
┌─ patongboxingstadiumticket.com (Frontend - Port 3000)
│  └─ Nuxt.js Application
│
├─ api-patongboxingstadiumticket.com (Backend - Port 4000)  
│  └─ Nest.js API
│
└─ VPS: 43.229.133.51
   ├─ Nginx (Reverse Proxy + SSL)
   ├─ PM2 (Process Manager)
   └─ Certbot (SSL Management)
```

## 📋 **Environment Variables**

### Frontend (ecosystem.config.cjs)
```javascript
NUXT_PUBLIC_API_BASE: "https://api-patongboxingstadiumticket.com"
NUXT_PUBLIC_SOCKET_URL: "https://api-patongboxingstadiumticket.com"
NUXT_PUBLIC_APP_URL: "https://patongboxingstadiumticket.com"
```

### Backend
```javascript
PORT: 4000
CORS_ORIGIN: "https://patongboxingstadiumticket.com"
DATABASE_URL: "postgresql://..."
JWT_SECRET: "your-secret"
```

## 🔍 **Monitoring & Troubleshooting**

### Health Checks
```bash
# Check both domains
curl https://patongboxingstadiumticket.com
curl https://api-patongboxingstadiumticket.com/health

# Check PM2 status
pm2 status patong-boxing-stadium
pm2 logs patong-boxing-stadium
```

### SSL Management
```bash
# Check certificates
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test SSL
sudo certbot renew --dry-run
```

### Nginx Management
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## 🚨 **Emergency Commands**

### Reset Everything
```bash
# Stop all processes
npm run pm2:cleanup

# Redeploy everything
npm run deploy:full
```

### Fix SSL Issues
```bash
# On VPS
sudo certbot --nginx -d patongboxingstadiumticket.com -d api-patongboxingstadiumticket.com
```

### Database Issues
```bash
# Check backend logs
pm2 logs patong-boxing-api

# Restart backend only
npm run deploy:backend
```

## 📁 **File Structure**

```
scripts/
├── full-deploy.sh      # Complete deployment
├── deploy-frontend.sh  # Frontend only
├── deploy-backend.sh   # Backend only
└── setup-domain.sh     # Domain configuration

Configuration:
├── ecosystem.config.cjs    # PM2 configuration
├── webhook-config.json     # Webhook settings
├── boxing-webhook.service  # Systemd service
└── health-check.sh         # Health monitoring
```

## 🎉 **Success Indicators**

✅ **DNS**: Both domains resolve to `43.229.133.51`
✅ **SSL**: Green lock icon in browser
✅ **Frontend**: https://patongboxingstadiumticket.com loads
✅ **Backend**: https://api-patongboxingstadiumticket.com/health returns 200
✅ **PM2**: `patong-boxing-stadium` status is `online`

---

**🥊 Ready to deploy your Patong Boxing Stadium ticket system!**
