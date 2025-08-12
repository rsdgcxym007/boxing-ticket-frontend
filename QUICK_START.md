# 🚀 Boxing Ticket Frontend - Quick Start Guide

## 📋 สรุปสิ่งที่ได้แก้ไขและเพิ่มเติม

### ✅ ปัญหาที่แก้ไขแล้ว

1. **Socket API ไม่สร้างซ้ำ**
   - แก้ไข `composables/useRealtime.ts` ใช้ Singleton pattern
   - แก้ไข `plugins/socket.client.ts` ป้องกัน multiple connections
   - เพิ่ม `forceNew: true` และ connection management

2. **Production Environment Ready**
   - Environment variables สำหรับ VPS: `http://43.229.133.51:4000`
   - WebSocket URL: `ws://43.229.133.51:4000/realtime`
   - PM2 configuration สำหรับ production

3. **Webhook Auto-deployment**
   - Webhook URL: `http://43.229.133.51:4100/hooks/deploy-frontend`
   - Discord notifications: ✅ พร้อมใช้งาน
   - Auto-deployment script พร้อม error handling

## 🛠️ ไฟล์ที่สร้างใหม่

### Scripts สำหรับ Production
```
deploy.sh              # Auto-deployment script
webhook-handler.sh      # Webhook handler
test-webhook.sh         # Test webhook functionality
setup-dev.sh           # Development setup
```

### Configuration Files
```
.env.production         # Production environment
ecosystem.config.js     # PM2 configuration (updated)
VPS_SETUP.md           # VPS setup instructions
```

### API & Health Check
```
server/api/health.get.ts   # Health check endpoint
```

## 🚀 การใช้งาน

### 1. Local Development
```bash
# Setup development environment
./setup-dev.sh

# Start development server
npm run dev

# Test API integration
./test-api-integration.sh
```

### 2. Production Deployment on VPS

#### A. Manual Deployment
```bash
# On VPS server
cd /var/www/boxing-ticket-frontend
./deploy.sh deploy
```

#### B. Webhook Deployment
```bash
# Test webhook locally
./test-webhook.sh

# Trigger deployment via webhook
curl -X POST http://43.229.133.51:4100/hooks/deploy-frontend
```

### 3. Monitoring & Health Check
```bash
# Check application health
curl http://43.229.133.51:3000/health

# Check PM2 status
pm2 status

# View logs
pm2 logs boxing-ticket-frontend
```

## 📊 API Integration Status

### ✅ Socket.IO ที่แก้ไขแล้ว
- **Single connection**: ไม่สร้าง Socket ซ้ำ
- **Production ready**: รองรับ production URL
- **Error handling**: จัดการ error และ reconnection
- **Type safety**: TypeScript support ครบถ้วน

### ✅ Environment Configuration
```bash
# Development
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_SOCKET_URL=http://localhost:4000
NUXT_PUBLIC_WS_URL=ws://localhost:4000/realtime

# Production  
NUXT_PUBLIC_API_BASE=http://43.229.133.51:4000
NUXT_PUBLIC_SOCKET_URL=http://43.229.133.51:4000
NUXT_PUBLIC_WS_URL=ws://43.229.133.51:4000/realtime
```

### ✅ Features ที่พร้อมใช้งาน
- 📊 **Analytics Dashboard**: `/admin/analytics`
- 🤖 **AI Recommendations**: Smart seat suggestions
- 📱 **Mobile Interface**: `/mobile`
- 🔔 **Real-time Notifications**: Live updates
- ⚡ **Live Seat Selection**: WebSocket integration

## 🔧 Webhook & Auto-deployment

### Discord Webhook
```
URL: https://discord.com/api/webhooks/1404715794205511752/H4H1Q-aJ2B1LwSpKxHYP7rt4tCWA0p10339NN5Gy71fhwXdj60ks__l
```

### Deployment Webhook
```
URL: http://43.229.133.51:4100/hooks/deploy-frontend
Method: POST
```

### การทำงานของ Webhook
1. **Trigger**: POST request ไปที่ webhook URL
2. **Process**: ดึง code ใหม่จาก Git repository
3. **Build**: Build application สำหรับ production
4. **Deploy**: Restart PM2 application
5. **Notify**: ส่งแจ้งเตือนไปยัง Discord

## 📱 Testing

### Test Webhook
```bash
# Test all webhook functions
./test-webhook.sh all

# Test Discord notification only
./test-webhook.sh discord

# Test deployment webhook only
./test-webhook.sh webhook
```

### Test API Integration
```bash
# Comprehensive API test
./test-api-integration.sh

# Skip build test (faster)
./test-api-integration.sh --skip-build
```

## 🏥 Health Monitoring

### Health Check Endpoints
```bash
# Application health
GET http://43.229.133.51:3000/health

# Webhook server health  
GET http://43.229.133.51:4100/health
```

### Health Check Response
```json
{
  "status": "healthy",
  "timestamp": "2025-08-12T19:22:27.000Z",
  "version": "1.0.31",
  "checks": {
    "api": {
      "status": "healthy",
      "responseTime": 150,
      "url": "http://43.229.133.51:4000"
    },
    "websocket": {
      "status": "configured",
      "url": "ws://43.229.133.51:4000/realtime"
    },
    "memory": {
      "status": "healthy",
      "usage": {
        "rss": 145,
        "heapTotal": 89,
        "heapUsed": 67,
        "external": 8
      }
    }
  }
}
```

## 🔒 Security & Performance

### Security Features
- ✅ CORS configuration
- ✅ Rate limiting ready
- ✅ Input validation
- ✅ Error handling
- ✅ Environment secrets

### Performance Optimizations
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Bundle optimization
- ✅ Lazy loading
- ✅ PM2 cluster mode

## 🚨 Troubleshooting

### Common Issues & Solutions

1. **Socket Connection Failed**
   ```bash
   # Check WebSocket URL in console
   # Verify backend is running on port 4000
   ```

2. **Webhook Not Working**
   ```bash
   # Test webhook server
   curl http://43.229.133.51:4100/health
   
   # Check webhook logs
   pm2 logs webhook-server
   ```

3. **Build Errors**
   ```bash
   # Clear cache and rebuild
   rm -rf .nuxt .output node_modules
   npm install
   npm run build
   ```

4. **PM2 Issues**
   ```bash
   # Restart PM2
   pm2 restart all
   
   # Reset PM2
   pm2 delete all
   pm2 start ecosystem.config.js --env production
   ```

## 📞 Support Commands

### Quick Commands
```bash
# Check all services
curl http://43.229.133.51:3000/health && \
curl http://43.229.133.51:4100/health && \
pm2 status

# Restart everything
pm2 restart all

# View recent logs
pm2 logs --lines 50

# Test webhook
./test-webhook.sh discord
```

### Emergency Recovery
```bash
# If application crashes
cd /var/www/boxing-ticket-frontend
git pull origin main
npm run build
pm2 restart boxing-ticket-frontend

# If webhook server crashes  
pm2 restart webhook-server
```

## 🎯 Next Steps

### Immediate Tasks
1. ✅ **Deploy to VPS**: Upload files และ setup VPS server
2. ✅ **Test Webhook**: ทดสอบ auto-deployment
3. ✅ **Configure Domain**: ตั้งค่า domain name (optional)
4. ✅ **SSL Certificate**: ติดตั้ง SSL สำหรับ HTTPS (optional)

### Future Enhancements
- 📧 **Email Notifications**: เพิ่มการส่ง email alerts
- 📱 **Mobile App**: Progressive Web App (PWA)
- 🔄 **Database Backup**: Auto backup system
- 📈 **Advanced Analytics**: More detailed metrics

## 📚 Documentation Links

- **API Integration**: `API_INTEGRATION_README.md`
- **VPS Setup**: `VPS_SETUP.md`
- **Production Deployment**: `PRODUCTION_DEPLOYMENT.md`
- **Project Summary**: `API_INTEGRATION_SUMMARY.md`

---

## ✨ สรุป

ระบบ Boxing Ticket Frontend พร้อมใช้งานแล้วพร้อมด้วย:

- 🔧 **Socket API ที่แก้ไขแล้ว**: ไม่สร้างซ้ำ
- 🚀 **Auto-deployment**: Webhook + Discord notifications
- 📊 **Health monitoring**: Comprehensive health checks
- 🏭 **Production ready**: VPS configuration
- 🧪 **Testing suite**: Automated testing scripts

**พร้อมสำหรับการใช้งานจริง! 🎉**
