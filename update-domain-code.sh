#!/bin/bash

# 🔄 Code Update Script for Domain Migration
# สำหรับอัปเดต code จาก IP เป็น domain patongboxingstadiumticket.com

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
OLD_URL="http://43.229.133.51:3000"
OLD_IP="43.229.133.51:3000"
NEW_DOMAIN="patongboxingstadiumticket.com"
NEW_URL="https://patongboxingstadiumticket.com"
FRONTEND_PORT="3000"
BACKEND_PORT="4000"

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Function to backup files
backup_files() {
    echo -e "${BLUE}📦 Creating backup...${NC}"
    
    BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
    mkdir -p $BACKUP_DIR
    
    # Files to backup
    FILES_TO_BACKUP=(
        "nuxt.config.ts"
        "composables/useApi.ts"
        "app.vue"
        "ecosystem.config.cjs"
        ".env"
        ".env.production"
        "server/api/services/qr-code.service.ts"
        "server/api/services/email.service.ts"
    )
    
    for file in "${FILES_TO_BACKUP[@]}"; do
        if [[ -f "$file" ]]; then
            cp "$file" "$BACKUP_DIR/" 2>/dev/null || true
        fi
    done
    
    print_status "Backup created in $BACKUP_DIR"
}

# Function to update nuxt.config.ts
update_nuxt_config() {
    print_info "Updating nuxt.config.ts..."
    
    if [[ -f "nuxt.config.ts" ]]; then
        # Create updated nuxt.config.ts
        cat > nuxt.config.ts <<'EOF'
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Runtime configuration
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
        { rel: 'canonical', href: 'https://patongboxingstadiumticket.com' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // CSS Framework
  css: ['~/assets/css/main.css'],
  
  // Tailwind CSS
  tailwindcss: {
    configPath: 'tailwind.config.ts'
  },

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true
  },

  // Build configuration
  build: {
    transpile: ['@pinia/nuxt']
  },

  // Nitro configuration for production
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  },

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  // i18n configuration
  i18n: {
    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'th', file: 'th.json' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'th'
  },

  // Development server
  devServer: {
    port: 3000,
    host: '0.0.0.0'
  }
});
EOF
        print_status "nuxt.config.ts updated"
    else
        print_warning "nuxt.config.ts not found"
    fi
}

# Function to update useApi composable
update_api_composable() {
    print_info "Updating composables/useApi.ts..."
    
    mkdir -p composables
    
    cat > composables/useApi.ts <<'EOF'
export const useApi = () => {
  const config = useRuntimeConfig();
  
  const baseURL = config.public.apiBaseUrl;

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
      
      // Log requests in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request:', request, options);
      }
    },
    onResponse({ request, response }) {
      // Log responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response:', response.status, response.statusText);
      }
    },
    onResponseError({ request, response }) {
      console.error('API Error:', response.status, response.statusText);
      
      // Handle authentication errors
      if (response.status === 401) {
        if (process.client) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigateTo('/mobile/login');
        }
      }
      
      // Handle server errors
      if (response.status >= 500) {
        console.error('Server error:', response);
      }
    }
  });

  return {
    get: (url: string, params?: any) => api(url, { method: 'GET', params }),
    post: (url: string, body?: any) => api(url, { method: 'POST', body }),
    put: (url: string, body?: any) => api(url, { method: 'PUT', body }),
    patch: (url: string, body?: any) => api(url, { method: 'PATCH', body }),
    delete: (url: string) => api(url, { method: 'DELETE' }),
  };
};

// Export typed API methods
export const useTypedApi = () => {
  const { get, post, put, patch, delete: del } = useApi();

  return {
    // Order APIs
    orders: {
      list: () => get('/api/v1/orders'),
      get: (id: string) => get(`/api/v1/orders/${id}`),
      create: (data: any) => post('/api/v1/orders', data),
      update: (id: string, data: any) => put(`/api/v1/orders/${id}`, data),
      delete: (id: string) => del(`/api/v1/orders/${id}`),
      getQR: (id: string) => get(`/api/v1/orders/${id}/qr`)
    },

    // Scanner APIs
    scanner: {
      checkIn: (orderId: string, qrData: string) => 
        post(`/api/v1/mobile/scanner/check-in/${orderId}`, { qrData }),
      history: () => get('/api/v1/mobile/scanner/history'),
      validate: (qrData: string) => post('/api/v1/mobile/scanner/validate', { qrData })
    },

    // Auth APIs
    auth: {
      login: (credentials: any) => post('/api/v1/auth/login', credentials),
      logout: () => post('/api/v1/auth/logout'),
      me: () => get('/api/v1/auth/me'),
      refresh: () => post('/api/v1/auth/refresh')
    },

    // Admin APIs
    admin: {
      dashboard: () => get('/api/v1/admin/dashboard'),
      orders: () => get('/api/v1/admin/orders'),
      stats: () => get('/api/v1/admin/stats')
    }
  };
};
EOF

    print_status "useApi.ts updated"
}

# Function to update app.vue
update_app_vue() {
    print_info "Updating app.vue..."
    
    cat > app.vue <<'EOF'
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

// Global error handling
onErrorCaptured((error) => {
  console.error('Global error caught:', error);
  return false;
});
</script>

<style>
/* Global styles */
body {
  font-family: 'Noto Sans Thai', 'Roboto', sans-serif;
}

/* Disable zoom on mobile inputs */
input[type="color"],
input[type="date"],
input[type="datetime"],
input[type="datetime-local"],
input[type="email"],
input[type="month"],
input[type="number"],
input[type="password"],
input[type="search"],
input[type="tel"],
input[type="text"],
input[type="time"],
input[type="url"],
input[type="week"],
select:focus,
textarea {
  font-size: 16px !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
EOF

    print_status "app.vue updated"
}

# Function to create QR Code service
create_qr_service() {
    print_info "Creating QR Code service..."
    
    mkdir -p server/api/services
    
    cat > server/api/services/qr-code.service.ts <<'EOF'
import QRCode from 'qrcode';
import CryptoJS from 'crypto-js';

export class QRCodeService {
  private getBaseUrl(): string {
    // ใช้ environment variable
    if (process.env.NODE_ENV === 'production') {
      return process.env.NUXT_PUBLIC_APP_URL || 'https://patongstadiumboxing.com';
    }
    return 'http://localhost:3000';
  }

  private getEncryptionKey(): string {
    return process.env.QR_ENCRYPTION_KEY || 'default-qr-encryption-key';
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

  async generateCheckInURL(orderId: string, orderData: any): Promise<string> {
    try {
      const encryptedData = this.encryptOrderData(orderData);
      const baseUrl = this.getBaseUrl();
      
      return `${baseUrl}/api/v1/mobile/scanner/check-in/${orderId}?qr=${encodeURIComponent(encryptedData)}`;
    } catch (error) {
      console.error('Check-in URL generation failed:', error);
      throw new Error('Failed to generate check-in URL');
    }
  }

  validateQRData(encryptedData: string): any {
    try {
      const decryptedData = this.decryptOrderData(encryptedData);
      
      // ตรวจสอบว่าข้อมูลยังไม่หมดอายุ
      if (decryptedData.validUntil && new Date(decryptedData.validUntil) < new Date()) {
        throw new Error('QR Code has expired');
      }
      
      return decryptedData;
    } catch (error) {
      console.error('QR validation failed:', error);
      throw new Error('Invalid QR code');
    }
  }

  private encryptOrderData(data: any): string {
    const secretKey = this.getEncryptionKey();
    
    // เพิ่ม timestamp เพื่อป้องกัน replay attack
    const dataWithTimestamp = {
      ...data,
      timestamp: Date.now(),
      validUntil: data.validUntil || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(dataWithTimestamp), 
      secretKey
    ).toString();
    
    return encryptedData;
  }

  private decryptOrderData(encryptedData: string): any {
    const secretKey = this.getEncryptionKey();
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
      throw new Error('Failed to decrypt QR data');
    }
    
    return JSON.parse(decryptedData);
  }
}

// Export singleton instance
export const qrCodeService = new QRCodeService();
EOF

    print_status "QR Code service created"
}

# Function to create email service
create_email_service() {
    print_info "Creating Email service..."
    
    mkdir -p server/api/services
    
    cat > server/api/services/email.service.ts <<'EOF'
import nodemailer from 'nodemailer';

export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  private getBaseUrl(): string {
    if (process.env.NODE_ENV === 'production') {
      return process.env.NUXT_PUBLIC_APP_URL || 'https://patongstadiumboxing.com';
    }
    return 'http://localhost:3000';
  }

  async sendBookingConfirmation(order: any): Promise<void> {
    try {
      const baseUrl = this.getBaseUrl();
      
      const emailTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>ยืนยันการจองตั๋ว - Patong Stadium Boxing</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #c41e3a; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .qr-code { text-align: center; margin: 20px 0; }
            .footer { background: #333; color: white; padding: 20px; text-align: center; }
            .btn { display: inline-block; background: #c41e3a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🥊 Patong Stadium Boxing</h1>
              <p>ยืนยันการจองตั๋ว</p>
            </div>
            
            <div class="content">
              <h2>เรียน คุณ${order.customer_name}</h2>
              
              <p>ขอบคุณที่จองตั๋วชมการแข่งขันมวยไทยกับเรา!</p>
              
              <h3>🎫 รายละเอียดการจอง:</h3>
              <ul>
                <li><strong>Order ID:</strong> ${order.id}</li>
                <li><strong>วันแข่ง:</strong> ${order.show_date}</li>
                <li><strong>เวลา:</strong> ${order.show_time || '19:00 น.'}</li>
                <li><strong>ที่นั่ง:</strong> ${order.seats ? order.seats.join(', ') : order.ticket_type}</li>
                <li><strong>จำนวนเงิน:</strong> ${order.amount} บาท</li>
              </ul>
              
              <div class="qr-code">
                <h3>📱 QR Code สำหรับเข้าชม:</h3>
                <img src="${order.qr_code}" alt="QR Code" style="max-width: 200px;" />
                <p><small>แสดง QR Code นี้ที่หน้าสนาม</small></p>
              </div>
              
              <h3>📍 ที่ตั้งสนาม:</h3>
              <p>
                <strong>Patong Stadium Boxing</strong><br>
                สนามมวยไสน้ำเย็น (Air-Conditioned Stadium)<br>
                ป่าตอง ภูเก็ต<br>
                โทร: 076-123-456
              </p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="${baseUrl}/orders/${order.id}" class="btn">ดูรายละเอียดการจอง</a>
              </div>
              
              <h3>⚠️ ข้อมูลสำคัญ:</h3>
              <ul>
                <li>กรุณามาถึงสนามก่อนเวลาแข่ง 30 นาที</li>
                <li>แสดง QR Code และบัตรประชาชนที่หน้าสนาม</li>
                <li>สนามมีเครื่องปรับอากาศ</li>
                <li>มีที่จอดรถฟรี</li>
              </ul>
            </div>
            
            <div class="footer">
              <p>ขอบคุณที่ใช้บริการ Patong Stadium Boxing</p>
              <p>🌐 ${baseUrl} | 📞 076-123-456</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await this.sendEmail({
        to: order.customer_email,
        subject: `🥊 ยืนยันการจองตั๋ว #${order.id} - Patong Stadium Boxing`,
        html: emailTemplate
      });

      console.log(`Booking confirmation sent to ${order.customer_email}`);
    } catch (error) {
      console.error('Failed to send booking confirmation:', error);
      throw error;
    }
  }

  async sendEmail({ to, subject, html, text }: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<void> {
    try {
      const mailOptions = {
        from: `"Patong Stadium Boxing" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
EOF

    print_status "Email service created"
}

# Function to update environment files
update_env_files() {
    print_info "Creating environment files..."
    
    # Production environment
    cat > .env.production <<EOF
# App Configuration
NODE_ENV=production
NUXT_HOST=0.0.0.0
NUXT_PORT=3000

# Domain และ URL
DOMAIN=patongstadiumboxing.com
NUXT_PUBLIC_APP_URL=https://patongstadiumboxing.com
NUXT_PUBLIC_API_BASE_URL=https://patongstadiumboxing.com
APP_BASE_URL=https://patongstadiumboxing.com

# API Configuration
API_BASE_URL=https://patongstadiumboxing.com
BACKEND_URL=https://patongstadiumboxing.com

# Database (กรุณาแก้ไขตามจริง)
DATABASE_URL=postgresql://username:password@localhost:5432/boxing_tickets
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boxing_tickets
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT และ Security (กรุณาเปลี่ยนค่าเหล่านี้)
JWT_SECRET=your_jwt_secret_key_here_change_this
ENCRYPT_KEY=your_encryption_key_here_change_this
HASH_SALT=your_hash_salt_here_change_this

# QR Code Configuration
QR_ENCRYPTION_KEY=your_qr_encryption_key_here_change_this
QR_EXPIRE_HOURS=24

# Email Configuration (กรุณาแก้ไขตามจริง)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Payment Gateway (ถ้ามี)
PAYMENT_API_KEY=your_payment_api_key
PAYMENT_SECRET=your_payment_secret
EOF

    # Development environment
    cat > .env.development <<EOF
# App Configuration
NODE_ENV=development
NUXT_HOST=0.0.0.0
NUXT_PORT=3000

# Domain และ URL
DOMAIN=localhost:3000
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000

# API Configuration
API_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/boxing_tickets_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=boxing_tickets_dev
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT และ Security
JWT_SECRET=dev_jwt_secret
ENCRYPT_KEY=dev_encryption_key
HASH_SALT=dev_hash_salt

# QR Code Configuration
QR_ENCRYPTION_KEY=dev_qr_encryption_key
QR_EXPIRE_HOURS=24

# Email Configuration (development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EOF

    # Copy current .env to .env.local if exists
    if [[ -f ".env" ]]; then
        cp .env .env.local
        print_status "Current .env backed up to .env.local"
    fi

    print_status "Environment files created"
    print_warning "Please edit .env.production and .env.development with your actual values"
}

# Function to update package.json scripts
update_package_scripts() {
    print_info "Updating package.json scripts..."
    
    # Read current package.json
    if [[ -f "package.json" ]]; then
        # Create a backup
        cp package.json package.json.backup
        
        # Add new scripts (this is a simple approach - you might want to use jq for better JSON manipulation)
        echo "Please manually add these scripts to your package.json:"
        echo ""
        echo '"scripts": {'
        echo '  "build": "nuxt build",'
        echo '  "dev": "nuxt dev --dotenv .env.development",'
        echo '  "generate": "nuxt generate",'
        echo '  "preview": "nuxt preview",'
        echo '  "postinstall": "nuxt prepare",'
        echo '  "start": "node .output/server/index.mjs",'
        echo '  "start:prod": "NODE_ENV=production node .output/server/index.mjs",'
        echo '  "deploy": "npm run build && pm2 restart ecosystem.config.cjs --env production",'
        echo '  "logs": "pm2 logs",'
        echo '  "status": "pm2 status"'
        echo '}'
        
        print_warning "Package.json scripts need manual update"
    else
        print_warning "package.json not found"
    fi
}

# Function to find and replace URLs in files
replace_urls_in_files() {
    print_info "Replacing old URLs with new domain..."
    
    # Files to search and replace
    SEARCH_DIRS=(
        "pages"
        "components"
        "composables"
        "server"
        "stores"
    )
    
    # Patterns to replace
    PATTERNS=(
        "s|http://43\.229\.133\.51:3000|https://patongstadiumboxing.com|g"
        "s|43\.229\.133\.51:3000|patongstadiumboxing.com|g"
        "s|'http://43\.229\.133\.51:3000'|'https://patongstadiumboxing.com'|g"
        "s|\"http://43\.229\.133\.51:3000\"|\"https://patongstadiumboxing.com\"|g"
    )
    
    for dir in "${SEARCH_DIRS[@]}"; do
        if [[ -d "$dir" ]]; then
            echo "Searching in $dir..."
            
            for pattern in "${PATTERNS[@]}"; do
                find "$dir" -type f \( -name "*.vue" -o -name "*.ts" -o -name "*.js" \) -exec sed -i.bak "$pattern" {} \;
            done
            
            # Remove backup files
            find "$dir" -name "*.bak" -delete 2>/dev/null || true
        fi
    done
    
    print_status "URL replacement completed"
}

# Function to show summary
show_summary() {
    echo ""
    echo -e "${GREEN}🎉 Code update completed!${NC}"
    echo "=========================================="
    echo ""
    echo -e "${BLUE}📝 Files updated:${NC}"
    echo "✅ nuxt.config.ts - Updated with new domain"
    echo "✅ composables/useApi.ts - Updated API endpoints"
    echo "✅ app.vue - Updated with SEO and meta tags"
    echo "✅ server/api/services/qr-code.service.ts - Created"
    echo "✅ server/api/services/email.service.ts - Created"
    echo "✅ .env.production - Created"
    echo "✅ .env.development - Created"
    echo "✅ URLs replaced in Vue/TS files"
    echo ""
    echo -e "${BLUE}🔧 Next steps:${NC}"
    echo "1. Review and edit .env.production with actual values"
    echo "2. Update package.json scripts manually"
    echo "3. Test the application locally:"
    echo "   npm run dev"
    echo "4. Build for production:"
    echo "   npm run build"
    echo "5. Deploy to VPS:"
    echo "   ./setup-domain.sh"
    echo ""
    echo -e "${YELLOW}⚠️  Important:${NC}"
    echo "- Check all environment variables"
    echo "- Update JWT secrets and encryption keys"
    echo "- Test QR code generation"
    echo "- Verify email configuration"
    echo ""
}

# Main execution
main() {
    echo -e "${BLUE}🔄 Starting code update for domain migration${NC}"
    echo "From: $OLD_URL"
    echo "To: $NEW_URL"
    echo ""
    
    # Confirm before proceeding
    read -p "Do you want to proceed with the code update? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Update cancelled."
        exit 0
    fi
    
    echo ""
    echo "Starting code update process..."
    echo ""
    
    # Execute update steps
    backup_files
    update_nuxt_config
    update_api_composable
    update_app_vue
    create_qr_service
    create_email_service
    update_env_files
    update_package_scripts
    replace_urls_in_files
    
    show_summary
}

# Run if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
