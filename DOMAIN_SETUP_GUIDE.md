# 🌐 คู่มือการเชื่อม Domain กับ VPS
## สำหรับ Patong Boxing Stadium Ticket - patongboxingstadiumticket.com

---

## 📋 สารบัญ
1. [ข้อมูลพื้นฐาน](#ข้อมูลพื้นฐาน)
2. [ตั้งค่า DNS Records](#ตั้งค่า-dns-records)
3. [ตั้งค่า Nginx บน VPS](#ตั้งค่า-nginx-บน-vps)
4. [ติดตั้ง SSL Certificate](#ติดตั้ง-ssl-certificate)
5. [อัปเดต Environment Variables](#อัปเดต-environment-variables)
6. [อัปเดต Backend Code](#อัปเดต-backend-code)
7. [อัปเดต Frontend Code](#อัปเดต-frontend-code)
8. [Deploy และ Restart Services](#deploy-และ-restart-services)
9. [ทดสอบระบบ](#ทดสอบระบบ)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 ข้อมูลพื้นฐาน

### ข้อมูล VPS ปัจจุบัน:
```
🖥️ VPS IP: 43.229.133.51
🔧 Frontend Port: 3000 (Nuxt.js)
🔧 Backend Port: 4000 (Nest.js)
🌐 Current URL: http://43.229.133.51:3000
🆕 New Domain: patongboxingstadiumticket.com
```

### ข้อมูล Services:
```
⚙️ Frontend: Nuxt.js (Port 3000)
⚙️ Backend: Nest.js (Port 4000)
⚙️ Web Server: Nginx (Reverse Proxy)
⚙️ Process Manager: PM2
🔒 SSL: Let's Encrypt (Certbot)
```

---

## 🌍 ตั้งค่า DNS Records

### 1. เข้าไปยัง Domain Provider
เข้าไปที่เว็บไซต์ที่คุณซื้อ Domain (เช่น Namecheap, GoDaddy, etc.)

### 2. เพิ่ม DNS Records ใหม่
ไปที่หน้า **DNS Management** หรือ **Advanced DNS** แล้วเพิ่ม Records เหล่านี้:

```dns
# A Records (ชี้ไปยัง IP ของ VPS)
Type: A Record
Host: @
Value: 43.229.133.51
TTL: 3600

Type: A Record
Host: www
Value: 43.229.133.51
TTL: 3600

# CNAME Records (ตัวเลือกเพิ่มเติม)
Type: CNAME
Host: app
Value: patongboxingstadiumticket.com
TTL: 3600

Type: CNAME
Host: admin
Value: patongboxingstadiumticket.com
TTL: 3600

Type: CNAME
Host: api
Value: patongboxingstadiumticket.com
TTL: 3600
```

### 3. รอ DNS Propagation
- **เวลาที่ต้องรอ**: 1-48 ชั่วโมง (ปกติ 1-4 ชั่วโมง)
- **ตรวจสอบ**: ใช้ `nslookup patongboxingstadiumticket.com`

---

## ⚙️ ตั้งค่า Nginx บน VPS

### 1. เชื่อมต่อ VPS
```bash
ssh root@43.229.133.51
```

### 2. ติดตั้ง Nginx (ถ้ายังไม่มี)
```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3. สร้าง Nginx Configuration File
```bash
sudo nano /etc/nginx/sites-available/patongboxingstadiumticket.com
```

**เนื้อหาไฟล์:**
```nginx
server {
    listen 80;
    server_name patongboxingstadiumticket.com www.patongboxingstadiumticket.com;

    # กรณีมี static files
    location /assets/ {
        alias /var/www/patongboxing/public/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Routes - Proxy ไปยัง Nest.js Backend
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Frontend Routes - Proxy ไปยัง Nuxt.js
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
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

### 4. Enable Site
```bash
# สร้าง symbolic link
sudo ln -s /etc/nginx/sites-available/patongboxingstadiumticket.com /etc/nginx/sites-enabled/

# ลบ default site (ถ้ามี)
sudo rm /etc/nginx/sites-enabled/default

# ทดสอบ configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

---

## 🔒 ติดตั้ง SSL Certificate

### 1. ติดตั้ง Certbot
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### 2. สร้าง SSL Certificate
```bash
sudo certbot --nginx -d patongboxingstadiumticket.com -d www.patongboxingstadiumticket.com
```

**ทำตามขั้นตอน:**
1. ใส่ email address
2. ยอมรับ Terms of Service
3. เลือก redirect HTTP to HTTPS (แนะนำ: Yes)

### 3. ตั้งค่า Auto-renewal
```bash
# ทดสอบ renewal
sudo certbot renew --dry-run

# ตั้งค่า cron job (ถ้ายังไม่มี)
sudo crontab -e

# เพิ่มบรรทัดนี้:
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔧 อัปเดต Environment Variables

### 1. สร้าง/แก้ไข .env บน VPS
```bash
cd /path/to/your/project
nano .env.production
```

**เนื้อหาไฟล์ .env.production:**
```env
# App Configuration
NODE_ENV=production
NUXT_HOST=0.0.0.0
NUXT_PORT=3000

# Domain และ URL
DOMAIN=patongboxingstadiumticket.com
NUXT_PUBLIC_APP_URL=https://patongboxingstadiumticket.com
NUXT_PUBLIC_API_BASE_URL=https://patongboxingstadiumticket.com
APP_BASE_URL=https://patongboxingstadiumticket.com

# API Configuration
API_BASE_URL=https://patongboxingstadiumticket.com
BACKEND_URL=https://patongboxingstadiumticket.com:4000
BACKEND_PORT=4000

# Database (อัปเดตตามจริง)
DATABASE_URL=your_database_url
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boxing_tickets
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT และ Security
JWT_SECRET=your_jwt_secret_key
ENCRYPT_KEY=your_encryption_key
HASH_SALT=your_hash_salt

# Third-party Services
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Payment Gateway (ถ้ามี)
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET=your_payment_secret

# QR Code Configuration
QR_ENCRYPTION_KEY=your_qr_encryption_key
QR_EXPIRE_HOURS=24
```

### 2. สร้าง/แก้ไข .env.local (สำหรับ development)
```bash
# ในเครื่อง local
nano .env.development
```

**เนื้อหา:**
```env
NODE_ENV=development
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
```

---

## 💻 อัปเดต Backend Code

### 1. อัปเดต QR Code Generation Service
สร้าง/แก้ไข `server/api/services/qr-code.service.ts`:

```typescript
export class QRCodeService {
  private getBaseUrl(): string {
    // ใช้ environment variable
    if (process.env.NODE_ENV === 'production') {
      return process.env.NUXT_PUBLIC_APP_URL || 'https://patongboxingstadiumticket.com';
    }
    return 'http://localhost:3000';
  }

  async generateQRCode(orderId: string, orderData: any): Promise<string> {
    try {
      // Encrypt order data
      const encryptedData = this.encryptOrderData(orderData);
      
      // สร้าง URL ด้วย domain ใหม่
      const baseUrl = this.getBaseUrl();
      const qrUrl = `${baseUrl}/api/v1/mobile/scanner/check-in/${orderId}?qr=${encodeURIComponent(encryptedData)}`;
      
      // Generate QR Code
      const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });

      return qrCodeDataUrl;
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  private encryptOrderData(data: any): string {
    // ใช้ encryption library เช่น crypto-js
    const CryptoJS = require('crypto-js');
    const secretKey = process.env.QR_ENCRYPTION_KEY || 'default-secret-key';
    
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(data), 
      secretKey
    ).toString();
    
    return encryptedData;
  }
}
```

### 2. อัปเดต API Routes สำหรับ URL ใหม่
แก้ไข `server/api/v1/orders/[id]/qr.get.ts`:

```typescript
export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event);
    
    // ดึงข้อมูล order
    const order = await getOrderById(id);
    if (!order) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found'
      });
    }

    // สร้าง QR Code ด้วย URL ใหม่
    const qrService = new QRCodeService();
    const qrCodeDataUrl = await qrService.generateQRCode(id, {
      orderId: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      seats: order.seats,
      ticketType: order.ticket_type,
      amount: order.amount,
      showDate: order.show_date,
      validUntil: order.valid_until,
      createdAt: order.created_at
    });

    return {
      success: true,
      qrCode: qrCodeDataUrl,
      orderId: id,
      validUntil: order.valid_until
    };
  } catch (error) {
    console.error('QR generation failed:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate QR code'
    });
  }
});
```

### 3. อัปเดต Email Templates
แก้ไข email templates ให้ใช้ domain ใหม่:

```typescript
// server/api/services/email.service.ts
export class EmailService {
  private getBaseUrl(): string {
    return process.env.NUXT_PUBLIC_APP_URL || 'https://patongboxingstadiumticket.com';
  }

  async sendBookingConfirmation(order: any): Promise<void> {
    const baseUrl = this.getBaseUrl();
    
    const emailTemplate = `
      <h1>ยืนยันการจองตั๋ว - Patong Boxing Stadium Ticket</h1>
      <p>เรียน คุณ${order.customer_name}</p>
      
      <h2>รายละเอียดการจอง:</h2>
      <p>Order ID: ${order.id}</p>
      <p>วันแข่ง: ${order.show_date}</p>
      <p>ที่นั่ง: ${order.seats.join(', ')}</p>
      
      <h3>QR Code สำหรับเข้าชม:</h3>
      <img src="${order.qr_code}" alt="QR Code" />
      
      <p>คุณสามารถดูข้อมูลการจองได้ที่: 
         <a href="${baseUrl}/orders/${order.id}">${baseUrl}/orders/${order.id}</a>
      </p>
      
      <p>ขอบคุณที่ใช้บริการ Patong Boxing Stadium Ticket</p>
    `;

    await this.sendEmail({
      to: order.customer_email,
      subject: `ยืนยันการจองตั๋ว #${order.id} - Patong Boxing Stadium Ticket`,
      html: emailTemplate
    });
  }
}
```

---

## 🖥️ อัปเดต Frontend Code

### 1. อัปเดต nuxt.config.ts
```typescript
export default defineNuxtConfig({
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Public keys (exposed to frontend)
    public: {
      appUrl: process.env.NODE_ENV === 'production' 
        ? 'https://patongboxingstadiumticket.com' 
        : 'http://localhost:3000',
      apiBaseUrl: process.env.NODE_ENV === 'production'
        ? 'https://patongboxingstadiumticket.com'
        : 'http://localhost:3000',
      backendUrl: process.env.NODE_ENV === 'production'
        ? 'https://patongboxingstadiumticket.com'
        : 'http://localhost:4000',
      domain: process.env.NODE_ENV === 'production'
        ? 'patongboxingstadiumticket.com'
        : 'localhost:3000'
    }
  },

  // SEO Configuration
  app: {
    head: {
      title: 'Patong Boxing Stadium Ticket - Air-Conditioned Boxing Stadium',
      meta: [
        { name: 'description', content: 'Book tickets for Muay Thai fights at Patong Boxing Stadium - The only air-conditioned boxing stadium in Patong, Phuket' },
        { property: 'og:title', content: 'Patong Boxing Stadium Ticket' },
        { property: 'og:description', content: 'Air-conditioned boxing stadium in Patong, Phuket' },
        { property: 'og:url', content: 'https://patongboxingstadiumticket.com' },
        { property: 'og:image', content: 'https://patongboxingstadiumticket.com/images/og-image.jpg' }
      ],
      link: [
        { rel: 'canonical', href: 'https://patongboxingstadiumticket.com' }
      ]
    }
  },

  // Nitro configuration
  nitro: {
    preset: 'node-server'
  }
});
```

### 2. อัปเดต API Composable
แก้ไข `composables/useApi.ts`:

```typescript
export const useApi = () => {
  const config = useRuntimeConfig();
  
  const baseURL = config.public.apiBaseUrl;
  const backendURL = config.public.backendUrl;

  const api = $fetch.create({
    baseURL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ request, options }) {
      // เพิ่ม authorization header ถ้ามี token
      const token = process.client ? localStorage.getItem('token') : null;
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    },
    onResponseError({ response }) {
      console.error('API Error:', response.status, response.statusText);
      
      // Handle authentication errors
      if (response.status === 401) {
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigateTo('/mobile/login');
        }
      }
    }
  });

  // สำหรับ Backend API (Nest.js port 4000)
  const backendApi = $fetch.create({
    baseURL: backendURL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    onRequest({ request, options }) {
      const token = process.client ? localStorage.getItem('token') : null;
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }
  });

  return {
    // Frontend API calls (Nuxt server routes)
    get: (url: string, params?: any) => api(url, { method: 'GET', params }),
    post: (url: string, body?: any) => api(url, { method: 'POST', body }),
    put: (url: string, body?: any) => api(url, { method: 'PUT', body }),
    delete: (url: string) => api(url, { method: 'DELETE' }),
    
    // Backend API calls (Nest.js)
    backend: {
      get: (url: string, params?: any) => backendApi(url, { method: 'GET', params }),
      post: (url: string, body?: any) => backendApi(url, { method: 'POST', body }),
      put: (url: string, body?: any) => backendApi(url, { method: 'PUT', body }),
      delete: (url: string) => backendApi(url, { method: 'DELETE' }),
    }
  };
};
```

### 3. อัปเดต Meta Tags
สร้าง `app.vue` หรือแก้ไขให้มี meta tags ที่เหมาะสม:

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

// Global SEO
useSeoMeta({
  title: 'Patong Stadium Boxing - Air-Conditioned Boxing Stadium',
  ogTitle: 'Patong Stadium Boxing',
  description: 'Book tickets for Muay Thai fights at Patong Stadium Boxing - The only air-conditioned boxing stadium in Patong, Phuket',
  ogDescription: 'Air-conditioned boxing stadium in Patong, Phuket',
  ogImage: `${config.public.appUrl}/images/og-image.jpg`,
  ogUrl: config.public.appUrl,
  twitterTitle: 'Patong Stadium Boxing',
  twitterDescription: 'Air-conditioned boxing stadium in Patong, Phuket',
  twitterImage: `${config.public.appUrl}/images/og-image.jpg`,
  twitterCard: 'summary_large_image'
});

useHead({
  htmlAttrs: {
    lang: 'th'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'canonical',
      href: config.public.appUrl
    }
  ]
});
</script>
```

---

## 🚀 Deploy และ Restart Services

### 1. Deploy Code ใหม่ไป VPS
```bash
# ในเครื่อง local - commit changes
git add .
git commit -m "Update domain to patongstadiumboxing.com"
git push origin main

# ใน VPS - pull latest code
cd /path/to/your/project
git pull origin main

# Install dependencies (ถ้ามีการเปลี่ยนแปลง)
npm install

# Build production
npm run build
```

### 2. อัปเดต PM2 Configuration
สร้าง/แก้ไข `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [
    {
      name: 'patong-boxing-frontend',
      port: 3000,
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        NUXT_HOST: '0.0.0.0',
        NUXT_PORT: 3000,
        DOMAIN: 'patongstadiumboxing.com'
      },
      env_production: {
        NODE_ENV: 'production',
        NUXT_PUBLIC_APP_URL: 'https://patongstadiumboxing.com',
        NUXT_PUBLIC_API_BASE_URL: 'https://patongstadiumboxing.com'
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
```

### 3. Restart Services
```bash
# สร้าง logs directory
mkdir -p logs

# Restart PM2
pm2 delete all
pm2 start ecosystem.config.cjs --env production

# Restart Nginx
sudo systemctl restart nginx

# Check services status
pm2 status
sudo systemctl status nginx

# Monitor logs
pm2 logs --lines 50
```

---

## ✅ ทดสอบระบบ

### 1. ทดสอบ Domain Resolution
```bash
# ทดสอบ DNS
nslookup patongstadiumboxing.com
dig patongstadiumboxing.com

# ทดสอบจากเบราว์เซอร์
curl -I https://patongstadiumboxing.com
```

### 2. ทดสอบ URLs สำคัญ
เปิดเบราว์เซอร์ทดสอบ URLs เหล่านี้:

```
🌐 Homepage:
   https://patongstadiumboxing.com
   https://www.patongstadiumboxing.com

📱 Mobile Pages:
   https://patongstadiumboxing.com/mobile
   https://patongstadiumboxing.com/mobile/login
   https://patongstadiumboxing.com/mobile/scanner

🔧 Admin Pages:
   https://patongstadiumboxing.com/admin
   https://patongstadiumboxing.com/login

📲 API Endpoints:
   https://patongstadiumboxing.com/api/v1/health
   https://patongstadiumboxing.com/api/v1/mobile/scanner/check-in/test

🎫 Booking Flow:
   https://patongstadiumboxing.com/book-tickets
   https://patongstadiumboxing.com/StandingTicketForm
   https://patongstadiumboxing.com/ringside
```

### 3. ทดสอบ QR Code
1. สร้าง order ทดสอบ
2. Generate QR Code
3. ตรวจสอบว่า URL ใน QR Code ใช้ domain ใหม่
4. ทดสอบสแกน QR Code จากโทรศัพท์
5. ตรวจสอบการ redirect และการทำงาน

### 4. ทดสอบ SSL Certificate
```bash
# ตรวจสอบ SSL certificate
openssl s_client -servername patongstadiumboxing.com -connect patongstadiumboxing.com:443

# หรือใช้ online tools:
# https://www.ssllabs.com/ssltest/
# ใส่ patongstadiumboxing.com แล้วกด test
```

---

## 🔧 Troubleshooting

### ปัญหาที่อาจเจอและวิธีแก้:

#### 1. DNS ยังไม่ทำงาน
```bash
# ตรวจสอบ DNS propagation
nslookup patongstadiumboxing.com
dig patongstadiumboxing.com

# ลองใช้ DNS อื่น
nslookup patongstadiumboxing.com 8.8.8.8

# รอเวลาเพิ่มเติม (อาจต้องรอ 24-48 ชม.)
```

#### 2. Nginx Error
```bash
# ตรวจสอบ nginx configuration
sudo nginx -t

# ดู nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

#### 3. SSL Certificate Issues
```bash
# ดู certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal -d patongstadiumboxing.com

# ถ้าไม่ได้ ลองลบแล้วสร้างใหม่
sudo certbot delete --cert-name patongstadiumboxing.com
sudo certbot --nginx -d patongstadiumboxing.com -d www.patongstadiumboxing.com
```

#### 4. PM2 App ไม่ทำงาน
```bash
# ดู PM2 logs
pm2 logs

# Restart PM2 app
pm2 restart all

# หรือ start ใหม่
pm2 delete all
pm2 start ecosystem.config.cjs --env production

# ตรวจสอบ port
netstat -tulpn | grep :3000
```

#### 5. QR Code URLs ยังใช้ IP เก่า
```bash
# ตรวจสอบ environment variables
pm2 env 0

# อัปเดต environment variables
pm2 restart all --update-env

# หรือ restart ด้วย config ใหม่
pm2 delete all
pm2 start ecosystem.config.cjs --env production
```

#### 6. Database Connection Issues
```bash
# ตรวจสอบ database connection
psql -h localhost -U your_user -d boxing_tickets

# ตรวจสอบ environment variables
cat .env.production
```

### Emergency Rollback Plan:
ถ้ามีปัญหาใหญ่ สามารถ rollback กลับไปใช้ IP ชั่วคราว:

```bash
# แก้ไข nginx config กลับไปใช้ IP
sudo nano /etc/nginx/sites-available/default

# เพิ่ม server block:
server {
    listen 80;
    server_name 43.229.133.51;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... proxy headers
    }
}

# Restart nginx
sudo systemctl restart nginx
```

---

## 📞 การติดต่อและช่วยเหลือ

### เมื่อเสร็จสิ้นการตั้งค่า:
1. ✅ Domain สามารถเข้าถึงได้ผ่าน HTTPS
2. ✅ QR Code ใช้ URL ใหม่
3. ✅ Mobile Scanner ทำงานได้ปกติ
4. ✅ Admin Panel เข้าได้
5. ✅ Email notifications ใช้ domain ใหม่

### การบำรุงรักษา:
- ตรวจสอบ SSL certificate renewal ทุกเดือน
- Monitor server performance
- Backup database เป็นประจำ
- อัปเดต dependencies เป็นระยะ

---

**🎉 ยินดีด้วย! ตอนนี้ Patong Stadium Boxing ใช้ domain https://patongstadiumboxing.com แล้ว**

*สร้างโดย: AI Assistant*  
*วันที่: August 15, 2025*
