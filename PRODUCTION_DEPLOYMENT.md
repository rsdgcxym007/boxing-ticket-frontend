# 🚀 Production Deployment Guide

## Overview

คู่มือการ deploy ระบบ Boxing Ticket Frontend พร้อม API Integration สู่ production environment

## 📋 Pre-deployment Checklist

### 1. Code Quality
- [ ] ✅ All tests pass (`./test-api-integration.sh`)
- [ ] ✅ TypeScript compilation successful
- [ ] ✅ No ESLint errors
- [ ] ✅ Build process completes without errors
- [ ] ✅ All API endpoints tested
- [ ] ✅ WebSocket connections tested

### 2. Environment Configuration
- [ ] ✅ Production environment variables set
- [ ] ✅ API endpoints configured
- [ ] ✅ SSL certificates ready
- [ ] ✅ Database connections tested
- [ ] ✅ Redis connections tested

### 3. Security
- [ ] ✅ Authentication system secured
- [ ] ✅ API rate limiting configured
- [ ] ✅ CORS settings configured
- [ ] ✅ Environment secrets secured
- [ ] ✅ Input validation implemented

## 🌍 Environment Setup

### Production Environment Variables

Create `/etc/environment` or use your deployment platform's environment configuration:

```bash
# Production API Configuration
NUXT_PUBLIC_API_BASE=https://api.patongboxing.com
NUXT_PUBLIC_WS_URL=wss://api.patongboxing.com/realtime

# Application Configuration
NUXT_PUBLIC_APP_NAME="Patong Boxing Ticket System"
NUXT_PUBLIC_APP_VERSION="1.0.31"
NUXT_PUBLIC_APP_URL=https://tickets.patongboxing.com

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AI_RECOMMENDATIONS=true
ENABLE_REALTIME=true
ENABLE_MOBILE_APP=true
ENABLE_NOTIFICATIONS=true

# Performance
NITRO_PRESET=node-server
NUXT_PUBLIC_CACHE_MAX_AGE=3600

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
GOOGLE_ANALYTICS_ID=your_ga_id_here

# Security
NUXT_SECRET_KEY=your_secret_key_here
SESSION_PASSWORD=your_session_password_here
```

## 🏗️ Build Process

### 1. Local Build Test

```bash
# Install dependencies
npm ci

# Run tests
./test-api-integration.sh

# Build for production
npm run build

# Test production build locally
npm run preview
```

### 2. Production Build

```bash
# Set NODE_ENV
export NODE_ENV=production

# Clear previous builds
rm -rf .nuxt .output dist

# Install production dependencies only
npm ci --production

# Build application
npm run build

# Verify build
ls -la .output/
```

## 🚢 Deployment Options

### Option 1: Node.js Server Deployment

#### 1.1 Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Update ecosystem.config.js
cat > ecosystem.config.js << 'EOL'
module.exports = {
  apps: [
    {
      name: 'boxing-ticket-frontend',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0'
      },
      env_production: {
        NODE_ENV: 'production',
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0'
      },
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
}
EOL

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 1.2 Using Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY .output ./

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", ".output/server/index.mjs"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  boxing-ticket-frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NUXT_PUBLIC_API_BASE=https://api.patongboxing.com
      - NUXT_PUBLIC_WS_URL=wss://api.patongboxing.com/realtime
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ./logs:/app/logs
```

### Option 2: Vercel Deployment

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "nuxt.config.ts",
      "use": "@nuxtjs/vercel-builder"
    }
  ],
  "env": {
    "NUXT_PUBLIC_API_BASE": "https://api.patongboxing.com",
    "NUXT_PUBLIC_WS_URL": "wss://api.patongboxing.com/realtime"
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    }
  ]
}
```

```bash
# Deploy to Vercel
npx vercel --prod
```

### Option 3: Netlify Deployment

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "8"

[[redirects]]
  from = "/api/*"
  to = "https://api.patongboxing.com/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

## 🔧 Nginx Configuration

```nginx
# /etc/nginx/sites-available/boxing-ticket-frontend
server {
    listen 80;
    server_name tickets.patongboxing.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tickets.patongboxing.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'; frame-ancestors 'self';" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # WebSocket upgrade
    location /socket.io/ {
        proxy_pass https://api.patongboxing.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # API proxy
    location /api/ {
        proxy_pass https://api.patongboxing.com;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Main application
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

## 📊 Monitoring และ Logging

### 1. Health Check Endpoint

```typescript
// server/api/health.get.ts
export default defineEventHandler(async (event) => {
  try {
    // Check database connection
    // Check Redis connection
    // Check external API availability
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NUXT_PUBLIC_APP_VERSION,
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    }
  } catch (error) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Service Unavailable'
    })
  }
})
```

### 2. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs boxing-ticket-frontend

# Restart application
pm2 restart boxing-ticket-frontend

# Reload without downtime
pm2 reload boxing-ticket-frontend
```

### 3. Log Configuration

```javascript
// ecosystem.config.js - enhanced logging
module.exports = {
  apps: [{
    name: 'boxing-ticket-frontend',
    script: './.output/server/index.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      NITRO_PORT: 3000
    },
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Auto restart on file changes
    watch: false,
    
    // Graceful shutdown
    kill_timeout: 1600,
    wait_ready: true,
    
    // Advanced features
    instance_var: 'INSTANCE_ID',
    combine_logs: true
  }]
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: ./test-api-integration.sh --skip-build
      
      - name: Build application
        run: npm run build
        env:
          NODE_ENV: production
          NUXT_PUBLIC_API_BASE: ${{ secrets.API_BASE_URL }}
          NUXT_PUBLIC_WS_URL: ${{ secrets.WS_URL }}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: npm run build
        env:
          NODE_ENV: production
          NUXT_PUBLIC_API_BASE: ${{ secrets.API_BASE_URL }}
          NUXT_PUBLIC_WS_URL: ${{ secrets.WS_URL }}
      
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/boxing-ticket-frontend
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload boxing-ticket-frontend
```

## 🚨 Troubleshooting

### Common Issues

1. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm run build
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

3. **WebSocket Connection Issues**
   ```nginx
   # Add to nginx config
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection "upgrade";
   ```

4. **SSL Certificate Issues**
   ```bash
   # Renew Let's Encrypt certificate
   certbot renew
   systemctl reload nginx
   ```

### Performance Optimization

1. **Enable Compression**
   ```bash
   # In nginx.conf
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. **Optimize Images**
   ```bash
   # Install sharp for image optimization
   npm install sharp
   ```

3. **Database Connection Pooling**
   ```typescript
   // Configure connection pooling in backend
   const pool = {
     max: 20,
     min: 5,
     idle: 30000,
     acquire: 60000
   }
   ```

## 📈 Performance Monitoring

### Metrics to Monitor

- Response time
- Memory usage
- CPU usage
- Active connections
- Error rates
- WebSocket connections

### Monitoring Tools

1. **PM2 Plus** (Recommended)
2. **New Relic**
3. **DataDog**
4. **Grafana + Prometheus**

## 🔒 Security Checklist

- [ ] ✅ SSL/TLS certificates installed
- [ ] ✅ Security headers configured
- [ ] ✅ Rate limiting implemented
- [ ] ✅ API authentication secured
- [ ] ✅ Environment variables secured
- [ ] ✅ Database access restricted
- [ ] ✅ File upload restrictions
- [ ] ✅ Input validation implemented

## 📞 Support

### Emergency Contacts
- **Developer**: [Your contact]
- **DevOps**: [DevOps contact]
- **System Admin**: [SysAdmin contact]

### Documentation
- API Documentation: `API_INTEGRATION_README.md`
- Development Guide: `README.md`
- Testing Guide: `./test-api-integration.sh --help`

---

**Happy Deployment! 🚀**
