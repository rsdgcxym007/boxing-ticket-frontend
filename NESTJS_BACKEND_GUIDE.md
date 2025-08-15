# 🗄️ Nest.js Backend Setup Guide
## สำหรับ Patong Boxing Stadium Ticket Backend - Port 4000

---

## 📋 ข้อมูลพื้นฐาน

### Backend Architecture:
```
🔧 Framework: Nest.js
🔌 Port: 4000
🌐 URL: https://patongboxingstadiumticket.com/api/*
📂 Project Directory: /var/www/patongboxing-backend
🔗 Frontend Integration: Proxy ผ่าน Nginx
```

### API Structure:
```
📡 Auth APIs: /api/auth/*
🎫 Order APIs: /api/orders/*
👥 User APIs: /api/users/*
📱 Scanner APIs: /api/scanner/*
📊 Admin APIs: /api/admin/*
```

---

## 🚀 Backend Setup

### 1. Project Structure
```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── guards/
│   ├── orders/
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.module.ts
│   │   └── dto/
│   ├── scanner/
│   │   ├── scanner.controller.ts
│   │   ├── scanner.service.ts
│   │   └── scanner.module.ts
│   ├── users/
│   ├── config/
│   ├── database/
│   ├── common/
│   └── main.ts
├── package.json
├── ecosystem.backend.config.cjs
└── .env.production
```

### 2. Environment Variables (.env.production)
```env
# App Configuration
NODE_ENV=production
PORT=4000
HOST=0.0.0.0

# Domain และ URLs
DOMAIN=patongboxingstadiumticket.com
FRONTEND_URL=https://patongboxingstadiumticket.com
API_BASE_URL=https://patongboxingstadiumticket.com/api

# Database
DATABASE_TYPE=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=boxing_tickets
DATABASE_USERNAME=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_URL=postgresql://username:password@localhost:5432/boxing_tickets

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=7d

# Encryption & Security
ENCRYPT_KEY=your_encryption_key
QR_ENCRYPTION_KEY=your_qr_encryption_key
HASH_ROUNDS=12

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=noreply@patongboxingstadiumticket.com

# File Upload
UPLOAD_DEST=./uploads
MAX_FILE_SIZE=5242880

# CORS Configuration
CORS_ORIGIN=https://patongboxingstadiumticket.com
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
CORS_CREDENTIALS=true

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 3. Main Application (main.ts)
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  app.setGlobalPrefix('api');

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
    methods: configService.get('CORS_METHODS'),
    credentials: configService.get('CORS_CREDENTIALS') === 'true',
  });

  // Swagger documentation
  if (configService.get('NODE_ENV') !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Patong Boxing Stadium Ticket API')
      .setDescription('API for boxing ticket booking system')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT') || 4000;
  const host = configService.get('HOST') || '0.0.0.0';
  
  await app.listen(port, host);
  console.log(`🚀 Backend server running on http://${host}:${port}`);
  console.log(`📚 API Docs available at http://${host}:${port}/api/docs`);
}

bootstrap();
```

### 4. App Module (app.module.ts)
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { ScannerModule } from './scanner/scanner.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseConfig } from './config/database.config';
import { MailConfig } from './config/mail.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.production',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),

    // Email
    MailerModule.forRootAsync({
      useClass: MailConfig,
    }),

    // Feature modules
    AuthModule,
    OrdersModule,
    UsersModule,
    ScannerModule,
    AdminModule,
  ],
})
export class AppModule {}
```

### 5. PM2 Configuration (ecosystem.backend.config.cjs)
```javascript
module.exports = {
  apps: [
    {
      name: 'patong-boxing-backend',
      script: 'dist/main.js',
      cwd: '/var/www/patongboxing-backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        HOST: '0.0.0.0',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        DOMAIN: 'patongboxingstadiumticket.com',
        FRONTEND_URL: 'https://patongboxingstadiumticket.com',
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      error_file: './logs/backend-err.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      max_restarts: 10,
      restart_delay: 4000,
      watch: false,
    }
  ]
};
```

---

## 🔌 API Controllers Examples

### 1. Auth Controller
```typescript
import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
```

### 2. Orders Controller
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';

@ApiTags('Orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  async findAll(@Query() query: any, @Request() req) {
    return this.ordersService.findAll(query, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.ordersService.findOne(id, req.user);
  }

  @Get(':id/qr')
  @ApiOperation({ summary: 'Generate QR code for order' })
  async generateQR(@Param('id') id: string, @Request() req) {
    return this.ordersService.generateQRCode(id, req.user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto, @Request() req) {
    return this.ordersService.update(id, updateOrderDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.ordersService.remove(id, req.user);
  }
}
```

### 3. Scanner Controller
```typescript
import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScannerService } from './scanner.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CheckInDto } from './dto/scanner.dto';

@ApiTags('Scanner')
@Controller('scanner')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ScannerController {
  constructor(private readonly scannerService: ScannerService) {}

  @Post('check-in/:orderId')
  @Roles('staff', 'admin')
  @ApiOperation({ summary: 'Check-in using QR code' })
  async checkIn(@Param('orderId') orderId: string, @Body() checkInDto: CheckInDto, @Request() req) {
    return this.scannerService.checkIn(orderId, checkInDto, req.user);
  }

  @Post('validate')
  @Roles('staff', 'admin')
  @ApiOperation({ summary: 'Validate QR code' })
  async validate(@Body() body: { qrData: string }, @Request() req) {
    return this.scannerService.validateQR(body.qrData, req.user);
  }

  @Get('history')
  @Roles('staff', 'admin')
  @ApiOperation({ summary: 'Get scan history' })
  async getHistory(@Request() req) {
    return this.scannerService.getHistory(req.user);
  }
}
```

---

## 🚀 Deployment Commands

### 1. Backend Deployment Script
```bash
#!/bin/bash
# deploy-backend.sh

echo "🚀 Deploying Nest.js Backend..."

# Navigate to backend directory
cd /var/www/patongboxing-backend

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build application
npm run build

# Stop existing PM2 process
pm2 delete patong-boxing-backend 2>/dev/null || true

# Start backend with PM2
pm2 start ecosystem.backend.config.cjs --env production

# Save PM2 configuration
pm2 save

echo "✅ Backend deployment completed!"
```

### 2. Manual Deployment Steps
```bash
# 1. Clone backend repository
git clone https://github.com/your-username/boxing-backend.git /var/www/patongboxing-backend
cd /var/www/patongboxing-backend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.production
# แก้ไข .env.production ตามจริง

# 4. Build application
npm run build

# 5. Setup database
npm run migration:run

# 6. Start with PM2
pm2 start ecosystem.backend.config.cjs --env production
pm2 save
pm2 startup
```

---

## 🔗 Frontend Integration

### 1. Nuxt.js API Calls
```typescript
// composables/useApi.ts
export const useApi = () => {
  const config = useRuntimeConfig();
  
  // ใช้ domain เดียวกัน แต่ Nginx จะ route /api/* ไปยัง backend port 4000
  const baseURL = config.public.apiBaseUrl; // https://patongboxingstadiumticket.com

  const api = $fetch.create({
    baseURL,
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
    // Auth APIs
    auth: {
      login: (credentials) => api('/api/auth/login', { method: 'POST', body: credentials }),
      register: (data) => api('/api/auth/register', { method: 'POST', body: data }),
      me: () => api('/api/auth/me'),
      logout: () => api('/api/auth/logout', { method: 'POST' })
    },

    // Order APIs  
    orders: {
      create: (data) => api('/api/orders', { method: 'POST', body: data }),
      list: (params) => api('/api/orders', { method: 'GET', params }),
      get: (id) => api(`/api/orders/${id}`),
      update: (id, data) => api(`/api/orders/${id}`, { method: 'PUT', body: data }),
      delete: (id) => api(`/api/orders/${id}`, { method: 'DELETE' }),
      getQR: (id) => api(`/api/orders/${id}/qr`)
    },

    // Scanner APIs
    scanner: {
      checkIn: (orderId, data) => api(`/api/scanner/check-in/${orderId}`, { method: 'POST', body: data }),
      validate: (qrData) => api('/api/scanner/validate', { method: 'POST', body: { qrData } }),
      history: () => api('/api/scanner/history')
    }
  };
};
```

---

## 📊 Monitoring & Logs

### 1. Check Backend Status
```bash
# PM2 status
pm2 status

# Check backend logs
pm2 logs patong-boxing-backend

# Check port 4000
netstat -tulpn | grep :4000

# Test API endpoint
curl https://patongboxingstadiumticket.com/api/auth/health
```

### 2. Database Connection Test
```bash
# Connect to PostgreSQL
psql -h localhost -U your_user -d boxing_tickets

# Check tables
\dt

# Check connections
SELECT * FROM pg_stat_activity;
```

### 3. Performance Monitoring
```bash
# CPU and Memory usage
htop

# Disk usage
df -h

# API response time test
curl -w "@curl-format.txt" https://patongboxingstadiumticket.com/api/auth/health
```

---

## 🔧 Troubleshooting

### 1. Backend Won't Start
```bash
# Check Node.js version
node --version

# Check package.json scripts
cat package.json | grep scripts -A 10

# Manual start for debugging
npm run start:prod

# Check error logs
pm2 logs patong-boxing-backend --lines 100
```

### 2. Database Connection Issues
```bash
# Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'your_database_url' });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

### 3. API Not Accessible
```bash
# Check Nginx configuration
sudo nginx -t

# Check if backend port is listening
ss -tlnp | grep :4000

# Test direct backend access
curl http://localhost:4000/api/health

# Check Nginx proxy logs
sudo tail -f /var/log/nginx/error.log
```

---

**🎯 สรุป**: Backend Nest.js ทำงานบน port 4000 และ Nginx จะ proxy requests ที่เป็น `/api/*` ไปยัง backend อัตโนมัติ

*📝 Created by: AI Assistant*  
*📅 Date: August 15, 2025*
