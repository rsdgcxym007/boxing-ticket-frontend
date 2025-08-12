# 🎫 Boxing Ticket Frontend - API Integration Guide

## 📋 Overview

ระบบจัดการตั๋วมวย (Boxing Ticket Management System) ที่ใช้ Nuxt3 + Vue3 + TypeScript พร้อมการ integrate กับ Backend API ตาม API Integration Guide

## 🚀 Features ใหม่ที่เพิ่มเข้ามา

### 📊 Analytics Dashboard
- **Sales Analytics**: รายงานยอดขายรายวัน, รายเดือน, และการเปรียบเทียบ
- **Realtime Monitoring**: ติดตามสถานะระบบแบบเรียลไทม์
- **Business Metrics**: ข้อมูลผู้ใช้ออนไลน์, อัตราการแปลง, และโซนยอดนิยม
- **Performance Tracking**: วิเคราะห์ประสิทธิภาพระบบ

### 🤖 AI Recommendations
- **Smart Seat Recommendations**: แนะนำที่นั่งที่เหมาะสมตามประวัติและความชอบ
- **Dynamic Pricing**: ปรับราคาแบบไดนามิกตามความต้องการ
- **User Behavior Analysis**: วิเคราะห์พฤติกรรมผู้ใช้เพื่อปรับปรุงบริการ
- **Revenue Optimization**: คำแนะนำเพื่อเพิ่มรายได้

### 📱 Mobile Experience
- **Mobile-First Design**: ออกแบบเพื่อมือถือเป็นหลัก
- **QR Code Scanner**: สแกน QR Code เพื่อตรวจสอบตั๋วและโปรโมชั่น
- **Offline Support**: รองรับการใช้งานออฟไลน์
- **Push Notifications**: การแจ้งเตือนแบบ Push

### 🔔 Notification System
- **Real-time Notifications**: การแจ้งเตือนแบบเรียลไทม์
- **Notification Preferences**: ตั้งค่าการแจ้งเตือนตามต้องการ
- **Multiple Channels**: รองรับการแจ้งเตือนหลายช่องทาง (Email, Push, SMS)

### ⚡ Realtime Features
- **Live Seat Selection**: ดูการเลือกที่นั่งแบบเรียลไทม์
- **WebSocket Integration**: การเชื่อมต่อแบบ WebSocket
- **Live Updates**: อัปเดตข้อมูลสดทันที
- **Connection Management**: จัดการการเชื่อมต่ออย่างมีประสิทธิภาพ

## 📁 โครงสร้างโปรเจ็กต์

```
boxing-ticket-frontend/
├── composables/               # API Integration Composables
│   ├── useAnalytics.ts       # Analytics API
│   ├── useAI.ts              # AI Recommendations API
│   ├── useMobile.ts          # Mobile API
│   ├── useNotifications.ts   # Notifications API
│   ├── useRealtime.ts        # WebSocket/Realtime API
│   └── existing files...
├── components/
│   ├── Analytics/            # Analytics Components
│   │   ├── StatsCard.vue
│   │   ├── SalesChart.vue
│   │   └── RealtimeHealth.vue
│   ├── Mobile/               # Mobile Components
│   │   ├── NotificationPanel.vue
│   │   ├── QRScanner.vue
│   │   └── HomeScreen.vue
│   ├── Realtime/             # Realtime Components
│   │   ├── SeatMap.vue
│   │   ├── LiveCounter.vue
│   │   └── ConnectionStatus.vue
│   └── existing components...
├── pages/
│   ├── admin/
│   │   └── analytics.vue     # Analytics Dashboard
│   ├── mobile/
│   │   └── index.vue         # Mobile Home
│   └── existing pages...
├── layouts/
│   ├── mobile.vue            # Mobile Layout
│   └── existing layouts...
├── plugins/
│   ├── socket.client.ts      # Socket.IO Plugin
│   └── existing plugins...
├── types/
│   └── api.ts                # API Types
├── utils/
│   └── errorHandler.ts       # Error Handling
└── existing files...
```

## 🔧 การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install @vueuse/nuxt vue-chartjs socket.io-client
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `.env`:

```bash
# Copy from .env.example
cp .env.example .env
```

แก้ไขค่าต่างๆ ตามความต้องการ:

```bash
# API Configuration
NUXT_PUBLIC_API_BASE=http://localhost:4000
NUXT_PUBLIC_WS_URL=ws://localhost:4000/realtime

# App Configuration
NUXT_PUBLIC_APP_NAME="Patong Boxing Ticket System"
NUXT_PUBLIC_APP_VERSION="1.0.31"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_AI_RECOMMENDATIONS=true
ENABLE_REALTIME=true
ENABLE_MOBILE_APP=true
ENABLE_NOTIFICATIONS=true
```

### 3. รันโปรเจ็กต์

```bash
# Development
npm run dev

# Production
npm run build
npm run start
```

## 📊 การใช้งาน Analytics API

### Basic Usage

```vue
<script setup>
import { useAnalytics } from '~/composables/useAnalytics'

const analytics = useAnalytics()

// Get daily sales data
const salesData = await analytics.getDailySales()

// Get system health
const health = await analytics.getSystemHealth()

// Get business metrics
const metrics = await analytics.getBusinessMetrics()
</script>
```

### Realtime Analytics

```vue
<script setup>
import { useRealtime } from '~/composables/useRealtime'

const realtime = useRealtime()

// Subscribe to analytics updates
realtime.subscribeToAnalytics()

// Listen for updates
window.addEventListener('analytics-update', (event) => {
  console.log('Analytics updated:', event.detail)
})
</script>
```

## 🤖 การใช้งาน AI Recommendations

### Seat Recommendations

```vue
<script setup>
import { useAI } from '~/composables/useAI'

const ai = useAI()

// Get seat recommendations
const recommendations = await ai.getSeatRecommendations(
  'user123',    // userId
  'zone456',    // zoneId
  5            // limit
)

// Get pricing recommendations
const pricing = await ai.getPricingRecommendations('zone456')
</script>
```

### User Behavior Analysis

```vue
<script setup>
const userBehavior = await ai.getUserBehaviorPredictions('user123')
console.log('Preferred zones:', userBehavior.preferredZones)
console.log('Price range:', userBehavior.priceRange)
</script>
```

## 📱 การใช้งาน Mobile API

### Home Screen Data

```vue
<script setup>
import { useMobile } from '~/composables/useMobile'

const mobile = useMobile()

// Get mobile home data
const homeData = await mobile.getHomeScreenData()
console.log('Announcements:', homeData.announcements)
console.log('Promotions:', homeData.promotions)
</script>
```

### QR Code Scanning

```vue
<script setup>
// Scan QR code
const result = await mobile.scanQRCode(qrCodeData)
if (result.valid) {
  console.log('QR data:', result.data)
  // Handle different QR types
  switch (result.type) {
    case 'ticket':
      // Navigate to ticket details
      break
    case 'seat':
      // Navigate to seat selection
      break
  }
}
</script>
```

## 🔔 การใช้งาน Notifications

### Basic Notifications

```vue
<script setup>
import { useNotifications } from '~/composables/useNotifications'

const notifications = useNotifications()

// Get notifications
await notifications.fetchNotifications()

// Mark as read
await notifications.markAsRead(notificationId)

// Mark all as read
await notifications.markAllAsRead()
</script>
```

### Notification Preferences

```vue
<script setup>
// Get preferences
const preferences = await notifications.getNotificationPreferences(userId)

// Update preferences
await notifications.updateNotificationPreferences(userId, {
  email: true,
  push: false,
  types: {
    bookingUpdates: true,
    promotions: false
  }
})
</script>
```

## ⚡ การใช้งาน Realtime Features

### WebSocket Connection

```vue
<script setup>
import { useRealtime } from '~/composables/useRealtime'

const realtime = useRealtime()

// Connect to realtime system
realtime.connect()

// Join zone room
realtime.joinZoneRoom('zone123')

// Listen for seat updates
watch(realtime.liveSeatSelections, (selections) => {
  console.log('Live selections:', selections)
})

// Emit seat selection
realtime.emitSeatSelection({
  seatId: 'A-15',
  userId: 'user123',
  zoneId: 'zone123',
  action: 'select'
})
</script>
```

### Realtime Seat Map

```vue
<template>
  <RealtimeSeatMap 
    :zone-id="currentZone"
    :show-activity-feed="true"
    :max-selections="8"
    @seat-selected="handleSeatSelected"
    @selection-changed="handleSelectionChanged"
  />
</template>

<script setup>
const handleSeatSelected = (seat) => {
  console.log('Seat selected:', seat)
}

const handleSelectionChanged = (selectedSeats) => {
  console.log('Selection changed:', selectedSeats)
}
</script>
```

## 🎨 Styling และ Design System

### Tailwind CSS Classes

```css
/* Analytics Components */
.analytics-card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow;
}

/* Mobile Components */
.mobile-card {
  @apply bg-white rounded-lg shadow-sm border border-gray-100 p-4;
}

.mobile-button {
  @apply w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors;
}

/* Seat Map */
.seat-available {
  @apply bg-gray-200 hover:bg-gray-300 border-gray-400 cursor-pointer;
}

.seat-selected {
  @apply bg-blue-500 text-white border-blue-600;
}

.seat-live-selection {
  @apply bg-yellow-400 text-black border-yellow-500 animate-pulse;
}
```

## 🔧 Error Handling

### API Error Handling

```typescript
import { ApiErrorHandler, withRetry } from '~/utils/errorHandler'

try {
  // API call with automatic retry
  const data = await withRetry(
    () => analytics.getDailySales(),
    3, // max attempts
    (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message)
    }
  )
} catch (error) {
  const apiError = ApiErrorHandler.handleApiError(error)
  const notification = formatErrorForNotification(apiError)
  
  showToast(notification.type, notification.message)
}
```

## 🚀 Performance Optimization

### Caching Strategy

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    routeRules: {
      // Analytics data - cache for 5 minutes
      '/api/analytics/**': { isr: 300 },
      // Mobile API - cache for 10 minutes
      '/api/mobile/home': { isr: 600 },
      // User-specific data - no cache
      '/api/notifications/**': { headers: { 'cache-control': 'no-cache' } }
    }
  }
})
```

### Lazy Loading

```vue
<script setup>
// Lazy load components
const AnalyticsChart = defineAsyncComponent(() => import('~/components/Analytics/Chart.vue'))
const RealtimeSeatMap = defineAsyncComponent(() => import('~/components/Realtime/SeatMap.vue'))
</script>
```

## 📱 Mobile-First Development

### Responsive Design

```vue
<template>
  <div class="container mx-auto px-4">
    <!-- Mobile-first grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Content -->
    </div>
  </div>
</template>
```

### Touch Interactions

```vue
<template>
  <div 
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    class="touch-friendly"
  >
    <!-- Touch-friendly content -->
  </div>
</template>
```

## 🔒 Security Considerations

### Authentication Headers

```typescript
// All API calls automatically include authentication
const { get, post } = useApi()

// Headers are managed automatically
const data = await get('/api/protected-endpoint')
```

### Input Validation

```typescript
// Validate API responses
import { validateApiResponse } from '~/utils/errorHandler'

const response = await fetch('/api/data')
const validatedData = validateApiResponse(await response.json())
```

## 📊 Monitoring และ Analytics

### Real-time Monitoring

```vue
<script setup>
// Monitor connection health
const { connectionStatus } = useRealtime()

watchEffect(() => {
  if (!connectionStatus.connected) {
    console.warn('Realtime connection lost')
    // Handle reconnection logic
  }
})
</script>
```

### Performance Tracking

```typescript
// Track API performance
console.time('API Call')
const data = await analytics.getDailySales()
console.timeEnd('API Call')
```

## 🚢 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Start production server
npm run start
```

### Environment Configuration

```bash
# Production environment
NODE_ENV=production
NUXT_PUBLIC_API_BASE=https://api.patongboxing.com
NUXT_PUBLIC_WS_URL=wss://api.patongboxing.com/realtime
```

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   ```typescript
   // Check connection status
   const realtime = useRealtime()
   if (!realtime.connectionStatus.value.connected) {
     realtime.reconnect()
   }
   ```

2. **API Timeout**
   ```typescript
   // Use retry mechanism
   const data = await withRetry(() => api.getData(), 3)
   ```

3. **Mobile Layout Issues**
   ```css
   /* Add viewport meta tag */
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

## 📚 Resources

- [Nuxt3 Documentation](https://nuxt.com/docs)
- [Vue3 Documentation](https://vuejs.org/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Socket.IO Client](https://socket.io/docs/v4/client-api/)
- [Chart.js](https://www.chartjs.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ by Patong Boxing Team**
