# 🔗 API Integration Summary

## ✅ API Endpoints Updated

### 1. **Orders API** (`useOrder.ts`)
- **GET** `/api/v1/orders` - ดึงรายการออเดอร์พร้อม pagination และ filters
- **GET** `/api/v1/orders/{id}` - ดึงข้อมูลออเดอร์เฉพาะ
- **POST** `/api/v1/orders` - สร้างออเดอร์ใหม่ (Legacy)
- **PATCH** `/api/v1/orders/{id}/cancel` - ยกเลิกออเดอร์
- **PATCH** `/api/v1/orders/{id}/confirm-payment` - ยืนยันการชำระเงิน

### 2. **Payments API** (`usePayments.ts`)
- **POST** `/api/v1/payments/standing` - สร้างการจองตั๋วยืน
- **POST** `/api/v1/payments/seated` - สร้างการจองตั๋วนั่ง
- **POST** `/api/v1/payments/{id}/slip` - อัพโหลดสลิปการชำระเงิน
- **GET** `/api/v1/payments/{id}` - ดึงข้อมูลการชำระเงิน
- **GET** `/api/v1/payments/order/{orderId}` - ดึงข้อมูลการชำระเงินจาก Order ID
- **GET** `/api/v1/payments` - ดึงรายการการชำระเงินทั้งหมด

### 3. **Dashboard API** (`useDashboard.ts`)
- **GET** `/api/v1/dashboard` - ข้อมูลแดชบอร์ดหลัก
- **GET** `/api/v1/dashboard/stats` - สถิติโดยรวม
- **GET** `/api/v1/dashboard/revenue` - วิเคราะห์รายได้
- **GET** `/api/v1/dashboard/occupancy` - ข้อมูลการใช้งานที่นั่ง
- **GET** `/api/v1/dashboard/performance` - ข้อมูลประสิทธิภาพ
- **GET** `/api/v1/dashboard/referrers` - วิเคราะห์ผู้แนะนำ
- **GET** `/api/v1/dashboard/activities` - กิจกรรมล่าสุด
- **GET** `/api/v1/dashboard/alerts` - แจ้งเตือนระบบ

### 4. **Seats API** (`useSeatApi.ts`)
- **GET** `/api/v1/seats/available` - ดึงที่นั่งที่ว่าง
- **POST** `/api/v1/seats/reserve` - จองที่นั่ง
- **GET** `/api/v1/seats/by-zone/{zoneId}` - ดึงที่นั่งตามโซน
- **PATCH** `/api/v1/seats/{seatId}/status` - อัพเดทสถานะที่นั่ง

### 5. **Referrers API** (`useReferrer.ts`)
- **GET** `/api/v1/referrers` - ดึงรายการผู้แนะนำ
- **POST** `/api/v1/referrers` - สร้างผู้แนะนำใหม่
- **PUT** `/api/v1/referrers/{id}` - อัพเดทผู้แนะนำ
- **GET** `/api/v1/referrers/{id}/orders` - ดึงออเดอร์ของผู้แนะนำ
- **GET** `/api/v1/referrers/{id}/export-pdf` - ส่งออกรายงาน PDF

## 🎯 **Usage Examples**

### Standing Ticket Purchase Flow
```typescript
// 1. Create Standing Payment
const { createStandingPayment } = usePayments()
const payment = await createStandingPayment({
  ticketType: "STANDING",
  standingAdultQty: 2,
  standingChildQty: 1,
  showDate: "2025-12-25",
  customerName: "สมชาย ใจดี",
  customerPhone: "0812345678",
  customerEmail: "somchai@example.com",
  paymentMethod: "QR_CODE",
  referrerCode: "FRESHYTOUR"
})

// 2. Upload Payment Slip
const { uploadPaymentSlip } = usePayments()
await uploadPaymentSlip(payment.id, slipFile)

// 3. Check Payment Status
const { getPaymentByOrderId } = usePayments()
const paymentStatus = await getPaymentByOrderId(payment.orderId)
```

### Dashboard Analytics
```typescript
// Get Dashboard Overview
const { getDashboard } = useDashboard()
const overview = await getDashboard()

// Get Revenue Analytics
const { getRevenueAnalytics } = useDashboard()
const revenue = await getRevenueAnalytics({
  period: 'weekly',
  startDate: '2025-07-01',
  endDate: '2025-07-31'
})

// Get Seat Occupancy
const { getSeatOccupancy } = useDashboard()
const occupancy = await getSeatOccupancy({
  showDate: '2025-07-08'
})
```

### Order Management
```typescript
// Get Orders with Filters
const { getOrders } = useOrder()
const orders = await getOrders({
  page: 1,
  limit: 20,
  status: 'CONFIRMED',
  startDate: '2025-07-01',
  endDate: '2025-07-31'
})

// Cancel Order
const { cancelOrder } = useOrder()
await cancelOrder('order-uuid')

// Confirm Payment
const { confirmPayment } = useOrder()
await confirmPayment('order-uuid')
```

### Seat Management
```typescript
// Get Available Seats
const { getAvailableSeats } = useSeatApi()
const seats = await getAvailableSeats({
  showDate: '2025-07-08',
  zone: 'RINGSIDE'
})

// Reserve Seats
const { reserveSeats } = useSeatApi()
await reserveSeats({
  seatIds: ['seat-1', 'seat-2'],
  showDate: '2025-07-08',
  userId: 'user-uuid'
})
```

### Referrer Management
```typescript
// Get Referrers
const { getReferrers } = useReferrer()
const referrers = await getReferrers({
  page: 1,
  limit: 10,
  search: 'freshy'
})

// Create Referrer
const { createReferrer } = useReferrer()
await createReferrer({
  name: 'Freshy Tour',
  code: 'FRESHYTOUR',
  email: 'contact@freshytour.com',
  commissionRate: 15
})

// Export Referrer Report
const { exportReferrerReport } = useReferrer()
await exportReferrerReport('referrer-id', {
  startDate: '2025-07-01',
  endDate: '2025-07-31',
  format: 'pdf'
})
```

## 🔧 **Configuration**

### Environment Variables
```bash
# API Base URL
API_BASE=http://localhost:3000

# Or for production
API_BASE=https://api.patongboxing.com
```

### Nuxt Config
```typescript
// nuxt.config.ts
runtimeConfig: {
  public: {
    apiBase: process.env.API_BASE || "http://localhost:3000"
  }
}
```

## 🎨 **Response Format**

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "customerEmail",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## 🔒 **Authentication**

### JWT Token
```typescript
// Headers automatically added by useApi
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Token Storage
```typescript
// Stored in localStorage
localStorage.setItem('token', jwtToken)
localStorage.setItem('user', JSON.stringify(user))
```

## 📊 **Data Models**

### Order Model
```typescript
interface Order {
  id: string;
  orderNumber: string;
  ticketType: 'STANDING' | 'SEATED';
  standingAdultQty?: number;
  standingChildQty?: number;
  standingTotal?: number;
  standingCommission?: number;
  seatNumbers?: string[];
  zoneId?: string;
  quantity: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  showDate: string;
  paymentMethod: string;
  referrerCode?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Payment Model
```typescript
interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: string;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  slipUrl?: string;
  commission?: number;
  qrCodeUrl?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Dashboard Stats Model
```typescript
interface DashboardStats {
  totalSales: string;
  monthSales: string;
  totalOrders: number;
  orderStatusCounts: {
    PENDING: number;
    CONFIRMED: number;
    CANCELLED: number;
  };
  availableSeats: number;
  nextShowDate: string;
  salesByZone: Array<{
    zone: string;
    amount: number;
    count: number;
  }>;
  dailySales: Array<{
    date: string;
    amount: number;
  }>;
}
```

## 🎯 **Best Practices**

### Error Handling
```typescript
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.error('API Error:', error)
  toast.error(`Operation failed: ${error.message}`)
  throw error
}
```

### Loading States
```typescript
const loading = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const data = await apiCall()
    return data
  } finally {
    loading.value = false
  }
}
```

### Pagination
```typescript
const { getOrders } = useOrder()

const fetchOrders = async (page = 1, limit = 10) => {
  const result = await getOrders({
    page,
    limit,
    status: selectedStatus.value,
    search: searchTerm.value
  })
  
  orders.value = result.items
  totalPages.value = result.totalPages
  currentPage.value = result.page
}
```

## 🚀 **Performance Tips**

1. **Use pagination** for large datasets
2. **Implement caching** for frequently accessed data
3. **Use loading states** for better UX
4. **Handle errors gracefully** with user-friendly messages
5. **Debounce search inputs** to reduce API calls
6. **Use query parameters** for filtering and sorting

---

**🎉 All API endpoints are now properly integrated with the Backend API specification!**
