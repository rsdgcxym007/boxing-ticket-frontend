// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  errors?: string[];
  statusCode?: number;
  path?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

// Analytics Types
export interface DailySalesData {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  hourlyBreakdown: Array<{
    hour: number;
    sales: number;
    orders: number;
  }>;
  paymentMethods: Record<
    string,
    {
      amount: number;
      count: number;
    }
  >;
}

export interface MonthlySalesData {
  year: number;
  month: number;
  totalSales: number;
  totalOrders: number;
  dailyBreakdown: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
}

export interface RealtimeHealth {
  systemStatus: "healthy" | "warning" | "critical";
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: number;
}

// AI Types
export interface SeatRecommendation {
  seatId: string;
  row: string;
  seatNumber: number;
  confidence: number;
  reasons: string[];
  price: number;
  zone: string;
  userPreferenceMatch: number;
}

export interface PricingRecommendation {
  zone: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  expectedDemand: number;
  revenueImpact: number;
  confidence: number;
}

// Mobile Types
export interface MobileHomeData {
  announcements: Announcement[];
  promotions: Promotion[];
  upcomingEvents: UpcomingEvent[];
  quickStats: QuickStats;
  banners?: Banner[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: "maintenance" | "promotion" | "info" | "warning";
  priority: "low" | "medium" | "high";
  isActive: boolean;
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number;
  validUntil: string;
  imageUrl?: string;
  terms?: string[];
  isActive: boolean;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  ticketPrice: number;
  availableSeats: number;
  description?: string;
  imageUrl?: string;
  category: string;
}

export interface QuickStats {
  totalEvents: number;
  totalSeats: number;
  availableSeats: number;
  popularZones: string[];
  todaySales: number;
  activeUsers: number;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  link?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "booking_success"
    | "payment_required"
    | "promotion"
    | "system"
    | "reminder"
    | "warning";
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
  actionUrl?: string;
  priority: "low" | "medium" | "high";
  expiresAt?: string;
}

// Realtime Types
export interface LiveSeatSelection {
  seatId: string;
  userId: string;
  userName?: string;
  action: "select" | "deselect";
  timestamp: string;
}

export interface ConnectionStatus {
  connected: boolean;
  reconnecting: boolean;
  lastConnected?: string;
  connectionCount: number;
}

// Seat Types
export interface Seat {
  id: string;
  number: string;
  zone: string;
  price: number;
  status: "available" | "occupied" | "disabled" | "reserved";
  row?: string;
  column?: number;
}

export interface Zone {
  id: string;
  name: string;
  price: number;
  available: number;
  total: number;
  description?: string;
  color?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff" | "user";
  phone?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: "th" | "en";
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: "light" | "dark" | "auto";
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  seats: Seat[];
  event: UpcomingEvent;
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt: string;
  qrCode?: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_transfer" | "qr_payment" | "cash";
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: "pending" | "completed" | "failed" | "cancelled";
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
}

// Settings Types
export interface SystemSettings {
  siteName: string;
  siteUrl: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
  features: {
    analytics: boolean;
    ai: boolean;
    realtime: boolean;
    mobile: boolean;
    notifications: boolean;
  };
}

// Export utility types
export type ApiHandler<T = any> = () => Promise<T>;
export type PaginatedApiHandler<T = any> = (
  page?: number,
  limit?: number
) => Promise<PaginatedResponse<T>>;

// Common response patterns
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  error: string;
  message: string;
}
