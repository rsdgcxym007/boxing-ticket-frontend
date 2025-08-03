// TypeScript Enums for all order-related types
export enum OrderStatus {
  PENDING = "PENDING",
  PENDING_SLIP = "PENDING_SLIP",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  BOOKED = "BOOKED",
  REFUNDED = "REFUNDED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentMethod {
  QR_CODE = "QR_CODE",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
}

export enum TicketType {
  RINGSIDE = "RINGSIDE",
  STADIUM = "STADIUM",
  STANDING = "STANDING",
}

export enum OrderSource {
  DIRECT = "DIRECT",
  KKDAY = "KKDAY",
  SAYAMA = "SAYAMA",
  ASIA_THAILAND = "ASIA_THAILAND",
  OTHER = "OTHER",
}

export enum OrderPurchaseType {
  WEBSITE = "WEBSITE",
  BOOKING = "BOOKING",
  ONSITE = "ONSITE",
}

export enum UserRole {
  USER = "user",
  STAFF = "staff",
  MANAGER = "manager",
  ADMIN = "admin",
  SYSTEM = "system",
}

export enum SeatStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  BOOKED = "BOOKED",
  PAID = "PAID",
  OCCUPIED = "OCCUPIED",
  BLOCKED = "BLOCKED",
  EMPTY = "EMPTY",
}

export enum BookingStatus {
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  BOOKED = "BOOKED",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
  AVAILABLE = "AVAILABLE",
}

export enum StandingTicketType {
  ADULT = "ADULT",
  CHILD = "CHILD",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  CANCEL = "CANCEL",
  CONFIRM = "CONFIRM",
  REFUND = "REFUND",
  VIEW = "VIEW",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export enum NotificationType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_PAID = "ORDER_PAID",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  ORDER_EXPIRED = "ORDER_EXPIRED",
  SEAT_ASSIGNED = "SEAT_ASSIGNED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  SLIP_VERIFICATION = "SLIP_VERIFICATION",
}

export enum ReportType {
  DAILY_SALES = "DAILY_SALES",
  MONTHLY_SALES = "MONTHLY_SALES",
  REFERRER_COMMISSION = "REFERRER_COMMISSION",
  SEAT_UTILIZATION = "SEAT_UTILIZATION",
  PAYMENT_METHODS = "PAYMENT_METHODS",
}

export enum ZoneType {
  RINGSIDE = "RINGSIDE",
  STADIUM = "STADIUM",
  VIP = "VIP",
  PREMIUM = "PREMIUM",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED_AMOUNT = "FIXED_AMOUNT",
  EARLY_BIRD = "EARLY_BIRD",
  GROUP = "GROUP",
}

export enum AttendanceStatus {
  PENDING = "PENDING",
  CHECKED_IN = "CHECKED_IN",
  NO_SHOW = "NO_SHOW",
}
