# 🥊 Patong Boxing Stadium Ticket - Domain Setup Documentation

> **เปลี่ยนจาก**: `http://43.229.133.51:3000`  
> **เป็น**: `https://patongboxingstadiumticket.com`

---

## 📋 สารบัญ

- [🎯 ข้อมูลโปรเจค](#ข้อมูลโปรเจค)
- [📁 ไฟล์ที่เกี่ยวข้อง](#ไฟล์ที่เกี่ยวข้อง)
- [🚀 วิธีการ Deploy](#วิธีการ-deploy)
- [⚡ Quick Start](#quick-start)
- [🔧 Manual Setup](#manual-setup)
- [🧪หลังจากทำตามคู่มือเสร็จ ระบบ **Patong Boxing Stadium Ticket** จะ:

1. 🌐 ใช้ domain **patongboxingstadiumticket.com** แทน IP
2. 🔒 มี HTTPS/SSL certificate อัตโนมัติ  
3. 📱 QR Code ใช้ URL ใหม่ทั้งหมด
4. 📧 Email notifications ใช้ domain ใหม่
5. 🔍 SEO optimized สำหรับ search engines
6. ⚡ Performance optimized ด้วย Nginx
7. 📊 Monitoring และ logging ครบถ้วน
8. 🗄️ Backend Nest.js บน port 4000
9. 🖥️ Frontend Nuxt.js บน port 3000

**🎯 เป้าหมาย**: ให้ลูกค้าสามารถจองตั๋วมวยไทยผ่าน **https://patongboxingstadiumticket.com** ได้อย่างสะดวกและปลอดภัย#การทดสอบ)
- [🐛 Troubleshooting](#troubleshooting)
- [📞 การติดต่อ](#การติดต่อ)

---

## 🎯 ข้อมูลโปรเจค

### รายละเอียดระบบ:
- **ชื่อ**: Patong Boxing Stadium Ticket
- **ประเภท**: ระบบจองตั๋วมวยไทยออนไลน์
- **สนาม**: สนามมวยไสน้ำเย็น (Air-Conditioned Boxing Stadium)
- **ที่ตั้ง**: ป่าตอง ภูเก็ต

### Tech Stack:
- **Frontend**: Nuxt.js 3 + Vue.js 3 (Port 3000)
- **Backend**: Nest.js + TypeScript (Port 4000)
- **Database**: PostgreSQL
- **State Management**: Pinia
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: JWT
- **QR Code**: QRCode.js + Crypto-JS
- **Deployment**: PM2 + Nginx + Let's Encrypt SSL

### เดิมและใหม่:
```
🔴 เดิม:  http://43.229.133.51:3000
🟢 ใหม่:  https://patongboxingstadiumticket.com
🔧 Frontend: Port 3000 (Nuxt.js)
🔧 Backend: Port 4000 (Nest.js)
```

---

## 📁 ไฟล์ที่เกี่ยวข้อง

### 📄 คู่มือและ Scripts:
```
📖 DOMAIN_SETUP_GUIDE.md      - คู่มือการตั้งค่า Domain แบบละเอียด
🗄️ NESTJS_BACKEND_GUIDE.md    - คู่มือ Backend Nest.js Port 4000
🤖 setup-domain.sh            - Script อัตโนมัติสำหรับตั้งค่า VPS
🔄 update-domain-code.sh      - Script อัปเดต Code สำหรับ Domain
📚 README_DOMAIN_SETUP.md     - ไฟล์นี้
```

### 🔧 Configuration Files:
```
⚙️ nuxt.config.ts              - Nuxt configuration
🔗 composables/useApi.ts       - API endpoints configuration
🌐 app.vue                     - Global app configuration + SEO
📦 ecosystem.config.cjs        - PM2 configuration (Frontend)
� ecosystem.backend.config.cjs - PM2 configuration (Backend)
�🔐 .env.production            - Production environment variables
🛠️ .env.development           - Development environment variables
```

### 🗂️ Server Files:
```
🔧 server/api/services/qr-code.service.ts    - QR Code service
📧 server/api/services/email.service.ts      - Email service
🌐 /etc/nginx/sites-available/patongboxingstadiumticket.com - Nginx config
```

---

## 🚀 วิธีการ Deploy

### ⚡ Option 1: Auto Deploy (แนะนำ)

**ใน VPS:**
```bash
# 1. Clone repository
git clone https://github.com/your-username/boxing-ticket-frontend.git
cd boxing-ticket-frontend

# 2. ให้สิทธิ์ scripts
chmod +x *.sh

# 3. อัปเดต code สำหรับ domain ใหม่
./update-domain-code.sh

# 4. Setup domain และ server
./setup-domain.sh
```

### 🔧 Option 2: Manual Setup

**ขั้นตอนที่ 1: ตั้งค่า DNS**
```dns
# เพิ่ม DNS Records ที่ Domain Provider
Type: A Record
Host: @
Value: 43.229.133.51
TTL: 3600

Type: A Record  
Host: www
Value: 43.229.133.51
TTL: 3600
```

**ขั้นตอนที่ 2: Setup Server**
```bash
# ใน VPS
ssh root@43.229.133.51

# ติดตั้ง packages
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx nodejs npm -y
sudo npm install -g pm2

# Clone และ setup project
git clone https://github.com/your-username/boxing-ticket-frontend.git /var/www/patongstadiumboxing
cd /var/www/patongstadiumboxing
npm install
npm run build
```

**ขั้นตอนที่ 3: Nginx Configuration**
```bash
# สร้าง nginx config
sudo nano /etc/nginx/sites-available/patongboxingstadiumticket.com

# Copy จาก DOMAIN_SETUP_GUIDE.md

# Enable site
sudo ln -s /etc/nginx/sites-available/patongboxingstadiumticket.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**ขั้นตอนที่ 4: SSL Certificate**
```bash
sudo certbot --nginx -d patongboxingstadiumticket.com -d www.patongboxingstadiumticket.com
```

**ขั้นตอนที่ 5: Start Application**
```bash
pm2 start ecosystem.config.cjs --env production
pm2 save
pm2 startup
```

---

## ⚡ Quick Start

### สำหรับ Developer ที่ต้องการ setup ใหม่:

```bash
# 1. Clone project
git clone https://github.com/your-username/boxing-ticket-frontend.git
cd boxing-ticket-frontend

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.development .env
# แก้ไขค่าใน .env ตามต้องการ

# 4. Start development
npm run dev

# 5. Open browser
open http://localhost:3000
```

### สำหรับ Production Deploy:

```bash
# 1. Update code สำหรับ domain
./update-domain-code.sh

# 2. Setup domain และ server
./setup-domain.sh

# 3. ตรวจสอบสถานะ
pm2 status
sudo systemctl status nginx

# 4. ดู logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🧪 การทดสอบ

### 🌐 ทดสอบ URLs สำคัญ:

```bash
# Homepage
curl -I https://patongboxingstadiumticket.com
curl -I https://www.patongboxingstadiumticket.com

# Mobile Pages
curl -I https://patongboxingstadiumticket.com/mobile
curl -I https://patongboxingstadiumticket.com/mobile/login
curl -I https://patongboxingstadiumticket.com/mobile/scanner

# Admin Pages  
curl -I https://patongboxingstadiumticket.com/admin
curl -I https://patongboxingstadiumticket.com/login

# API Endpoints
curl https://patongboxingstadiumticket.com/api/health
curl https://patongboxingstadiumticket.com/api/auth/health
```

### 📱 ทดสอบ QR Code:

1. สร้าง order ทดสอบผ่าน admin
2. ดาวน์โหลด QR Code 
3. ตรวจสอบ URL ใน QR Code ว่าใช้ domain ใหม่
4. ทดสอบสแกน QR จากมือถือ
5. ตรวจสอบการ redirect และ check-in

### 🔒 ทดสอบ SSL:

```bash
# ตรวจสอบ certificate
openssl s_client -servername patongstadiumboxing.com -connect patongstadiumboxing.com:443

# ตรวจสอบ grade ที่ ssllabs.com
# https://www.ssllabs.com/ssltest/analyze.html?d=patongstadiumboxing.com
```

---

## 🐛 Troubleshooting

### ❌ DNS ไม่ทำงาน:
```bash
# ตรวจสอบ DNS propagation
nslookup patongboxingstadiumticket.com
dig patongboxingstadiumticket.com

# ใช้ DNS อื่นทดสอบ
nslookup patongboxingstadiumticket.com 8.8.8.8

# รอเวลา DNS propagation (1-48 ชม.)
```

### ❌ Nginx Error:
```bash
# ตรวจสอบ config
sudo nginx -t

# ดู error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### ❌ PM2 App ไม่ทำงาน:
```bash
# ดู logs
pm2 logs

# Restart apps
pm2 restart all

# ตรวจสอบ port
netstat -tulpn | grep :3000

# Start ใหม่
pm2 delete all
pm2 start ecosystem.config.cjs --env production
```

### ❌ SSL Certificate ปัญหา:
```bash
# ดู certificate
sudo certbot certificates

# Renew force
sudo certbot renew --force-renewal -d patongboxingstadiumticket.com

# ลบและสร้างใหม่
sudo certbot delete --cert-name patongboxingstadiumticket.com
sudo certbot --nginx -d patongboxingstadiumticket.com -d www.patongboxingstadiumticket.com
```

### ❌ Environment Variables ไม่ถูกต้อง:
```bash
# ตรวจสอบ PM2 env
pm2 env 0

# Update env
pm2 restart all --update-env

# แก้ไข .env.production
sudo nano /var/www/patongstadiumboxing/.env.production
pm2 restart all
```

### 🆘 Emergency Rollback:
```bash
# กลับไปใช้ IP ชั่วคราว
sudo nano /etc/nginx/sites-available/default

# เพิ่ม:
server {
    listen 80;
    server_name 43.229.133.51;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

sudo systemctl restart nginx
```

---

## 📞 การติดต่อ

### 🎯 เมื่อเสร็จสิ้นการตั้งค่าต้องได้:
- ✅ เข้า https://patongstadiumboxing.com ได้
- ✅ HTTPS ทำงานปกติ (SSL certificate)
- ✅ QR Code ใช้ URL ใหม่
- ✅ Mobile scanner ทำงานได้
- ✅ Admin panel เข้าได้
- ✅ Email notifications ใช้ domain ใหม่

### 🔧 การ Monitor:
```bash
# ตรวจสอบสถานะ services
pm2 status
sudo systemctl status nginx

# ดู logs real-time
pm2 logs --lines 50
sudo tail -f /var/log/nginx/access.log

# ตรวจสอบ disk usage
df -h

# ตรวจสอบ memory usage
free -h

# ตรวจสอบ SSL expiry
sudo certbot certificates
```

### 📅 การบำรุงรักษา:
- **ทุกสัปดาห์**: ตรวจสอบ logs และ performance
- **ทุกเดือน**: ตรวจสอบ SSL certificate renewal
- **ทุกไตรมาส**: อัปเดต dependencies และ security patches
- **ทุกปี**: Review และ renew domain registration

---

## 🎉 สรุป

หลังจากทำตามคู่มือนี้แล้ว ระบบ **Patong Stadium Boxing** จะ:

1. 🌐 ใช้ domain **patongstadiumboxing.com** แทน IP
2. 🔒 มี HTTPS/SSL certificate อัตโนมัติ  
3. 📱 QR Code ใช้ URL ใหม่ทั้งหมด
4. 📧 Email notifications ใช้ domain ใหม่
5. 🔍 SEO optimized สำหรับ search engines
6. ⚡ Performance optimized ด้วย Nginx
7. 📊 Monitoring และ logging ครบถ้วน

**🎯 เป้าหมาย**: ให้ลูกค้าสามารถจองตั๋วมวยไทยผ่าน **https://patongstadiumboxing.com** ได้อย่างสะดวกและปลอดภัย

---

*📝 สร้างโดย: AI Assistant*  
*📅 วันที่: August 15, 2025*  
*🏷️ Version: 1.0*

---

**Happy Boxing! 🥊**
