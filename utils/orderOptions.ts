// Enums moved to types/orderEnums.ts
// Order Status Options (full)
export const fullOrderStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "รอดำเนินการ" },
  { value: "PENDING_SLIP", label: "รออัปโหลดสลิป" },
  { value: "PAID", label: "ชำระแล้ว" },
  { value: "CONFIRMED", label: "ยืนยันแล้ว" },
  { value: "CANCELLED", label: "ยกเลิกแล้ว" },
  { value: "EXPIRED", label: "หมดอายุ" },
  { value: "BOOKED", label: "จองแล้ว" },
  { value: "REFUNDED", label: "คืนเงินแล้ว" },
  { value: "NO_SHOW", label: "ไม่มาแสดงตัว" },
];

// Payment Method Options (full)
export const fullPaymentMethodOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "QR_CODE", label: "คิวอาร์โค้ด" },
  { value: "CASH", label: "เงินสด" },
  { value: "BANK_TRANSFER", label: "โอนเงินผ่านธนาคาร" },
  { value: "CREDIT_CARD", label: "บัตรเครดิต" },
];

// Ticket Type Options
export const ticketTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "RINGSIDE", label: "ริงไซด์" },
  { value: "STADIUM", label: "สเตเดียม" },
  { value: "STANDING", label: "ตั๋วยืน" },
];

// Order Source Options
export const orderSourceOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "DIRECT", label: "จองตรง" },
  { value: "KKDAY", label: "KKDAY" },
  { value: "SAYAMA", label: "SAYAMA" },
  { value: "ASIA_THAILAND", label: "ASIA THAILAND" },
  { value: "OTHER", label: "อื่นๆ" },
];

// Purchase Type Options
export const purchaseTypeOptionsFull = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "WEBSITE", label: "เว็บไซต์" },
  { value: "BOOKING", label: "การจอง" },
  { value: "ONSITE", label: "หน้างาน" },
];

// User Role Options
export const userRoleOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "user", label: "ผู้ใช้" },
  { value: "staff", label: "พนักงาน" },
  { value: "manager", label: "ผู้จัดการ" },
  { value: "admin", label: "แอดมิน" },
  { value: "system", label: "ระบบ" },
];

// Seat Status Options
export const seatStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "AVAILABLE", label: "ว่าง" },
  { value: "RESERVED", label: "จองชั่วคราว" },
  { value: "BOOKED", label: "จองแล้ว" },
  { value: "PAID", label: "ชำระแล้ว" },
  { value: "OCCUPIED", label: "ใช้งานแล้ว" },
  { value: "BLOCKED", label: "บล็อค" },
  { value: "EMPTY", label: "ช่องว่าง" },
];

// Booking Status Options
export const bookingStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "รอดำเนินการ" },
  { value: "RESERVED", label: "จองชั่วคราว" },
  { value: "BOOKED", label: "จองแล้ว" },
  { value: "PAID", label: "ชำระแล้ว" },
  { value: "CONFIRMED", label: "ยืนยันแล้ว" },
  { value: "CANCELLED", label: "ยกเลิกแล้ว" },
  { value: "EXPIRED", label: "หมดอายุ" },
  { value: "AVAILABLE", label: "ว่าง" },
];

// Standing Ticket Type Options
export const standingTicketTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "ADULT", label: "ผู้ใหญ่" },
  { value: "CHILD", label: "เด็ก" },
];

// Payment Status Options (full)
export const fullPaymentStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "รอการชำระ" },
  { value: "PROCESSING", label: "กำลังตรวจสอบ" },
  { value: "PAID", label: "ชำระแล้ว" },
  { value: "FAILED", label: "ชำระไม่สำเร็จ" },
  { value: "REFUNDED", label: "คืนเงินแล้ว" },
  { value: "CANCELLED", label: "ยกเลิก" },
];

// Audit Action Options
export const auditActionOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "CREATE", label: "สร้าง" },
  { value: "UPDATE", label: "แก้ไข" },
  { value: "DELETE", label: "ลบ" },
  { value: "CANCEL", label: "ยกเลิก" },
  { value: "CONFIRM", label: "ยืนยัน" },
  { value: "REFUND", label: "คืนเงิน" },
  { value: "VIEW", label: "ดู" },
  { value: "LOGIN", label: "เข้าสู่ระบบ" },
  { value: "LOGOUT", label: "ออกจากระบบ" },
];

// Notification Type Options
export const notificationTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "ORDER_CREATED", label: "สร้างออเดอร์" },
  { value: "ORDER_PAID", label: "ชำระเงินแล้ว" },
  { value: "ORDER_CANCELLED", label: "ยกเลิกออเดอร์" },
  { value: "ORDER_EXPIRED", label: "ออเดอร์หมดอายุ" },
  { value: "SEAT_ASSIGNED", label: "กำหนดที่นั่ง" },
  { value: "PAYMENT_RECEIVED", label: "รับชำระเงิน" },
  { value: "SLIP_VERIFICATION", label: "ตรวจสอบสลิป" },
];

// Report Type Options
export const reportTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "DAILY_SALES", label: "ยอดขายรายวัน" },
  { value: "MONTHLY_SALES", label: "ยอดขายรายเดือน" },
  { value: "REFERRER_COMMISSION", label: "ค่าคอมมิชชั่นผู้แนะนำ" },
  { value: "SEAT_UTILIZATION", label: "การใช้ที่นั่ง" },
  { value: "PAYMENT_METHODS", label: "วิธีชำระเงิน" },
];

// Zone Type Options
export const zoneTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "RINGSIDE", label: "ริงไซด์" },
  { value: "STADIUM", label: "สเตเดียม" },
  { value: "VIP", label: "VIP" },
  { value: "PREMIUM", label: "พรีเมียม" },
];

// Discount Type Options
export const discountTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PERCENTAGE", label: "เปอร์เซ็นต์" },
  { value: "FIXED_AMOUNT", label: "จำนวนเงินคงที่" },
  { value: "EARLY_BIRD", label: "Early Bird" },
  { value: "GROUP", label: "กลุ่ม" },
];

// Attendance Status Options (full)
export const fullAttendanceStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "ยังไม่เช็คอิน" },
  { value: "CHECKED_IN", label: "เช็คอินแล้ว" },
  { value: "NO_SHOW", label: "ไม่มาร่วมงาน" },
];
// ตัวเลือกกลางสำหรับ order status และ payment method

export const orderStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "รอดำเนินการ" },
  //   { value: "PENDING_SLIP", label: "รออัปโหลดสลิป" },
  { value: "PAID", label: "ชำระแล้ว" },
  { value: "CONFIRMED", label: "ยืนยันแล้ว" },
  { value: "CANCELLED", label: "ยกเลิกแล้ว" },
  { value: "EXPIRED", label: "หมดอายุ" },
  { value: "BOOKED", label: "จองแล้ว" },
  //   { value: "REFUNDED", label: "คืนเงินแล้ว" },
  //   { value: "NO_SHOW", label: "ไม่มาแสดงตัว" },
];

export const paymentMethodOptions = [
  { value: undefined, label: "ทั้งหมด" },
  //   { value: "QR_CODE", label: "คิวอาร์โค้ด" },
  { value: "CASH", label: "เงินสด" },
  //   { value: "BANK_TRANSFER", label: "โอนเงินผ่านธนาคาร" },
  { value: "CREDIT_CARD", label: "บัตรเครดิต" },
];

export const purchaseTypeOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "WEBSITE", label: "เว็บไซต์" },
  { value: "BOOKING", label: "การจองบุ๊คกิ้ง" },
  { value: "ONSITE", label: "หน้างาน" },
];

export const attendanceStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "รอเข้าร่วม" },
  { value: "CHECKED_IN", label: "เช็คอินแล้ว" },
  { value: "NO_SHOW", label: "ไม่มาแสดงตัว" },
];

// ทืี่ backend รับ
// export enum OrderStatus {
//   PENDING = "PENDING", // รอชำระเงิน (5 นาที)
//   PENDING_SLIP = "PENDING_SLIP", // รอตรวจสอบสลิป (OCR)
//   PAID = "PAID", // ชำระเงินแล้ว
//   CONFIRMED = "CONFIRMED", // ยืนยันแล้ว (Staff/Admin)
//   CANCELLED = "CANCELLED", // ยกเลิก
//   EXPIRED = "EXPIRED", // หมดเวลา (5 นาที)
//   BOOKED = "BOOKED", // จองแล้ว (มีที่นั่ง)
//   REFUNDED = "REFUNDED", // คืนเงินแล้ว
//   NO_SHOW = "NO_SHOW", // ไม่มาดูการแสดง
// }

// export enum PaymentMethod {
//   QR_CODE = "QR_CODE",
//   CASH = "CASH", // เฉพาะ Staff/Admin
//   BANK_TRANSFER = "BANK_TRANSFER",
//   CREDIT_CARD = "CREDIT_CARD", // เตรียมรองรับอนาคต
// }

// export enum TicketType {
//   RINGSIDE = "RINGSIDE", // ที่นั่งริงไซด์
//   STADIUM = "STADIUM", // ที่นั่งสเตเดียม
//   STANDING = "STANDING", // ตั๋วยืน
// }

// export enum OrderSource {
//   DIRECT = "DIRECT", // จองตรง
//   KKDAY = "KKDAY",
//   SAYAMA = "SAYAMA",
//   ASIA_THAILAND = "ASIA_THAILAND",
//   OTHER = "OTHER",
// }

// export enum OrderPurchaseType {
//   WEBSITE = "WEBSITE", // ซื้อจากหน้าเว็บ
//   BOOKING = "BOOKING", // ซื้อจากการจอง
//   ONSITE = "ONSITE", // ซื้อหน้างาน (default)
// }

// export enum UserRole {
//   USER = "user",
//   STAFF = "staff",
//   MANAGER = "manager",
//   ADMIN = "admin",
//   SYSTEM = "system",
// }

// export enum SeatStatus {
//   AVAILABLE = "AVAILABLE",
//   RESERVED = "RESERVED", // จองชั่วคราว (5 นาที)
//   BOOKED = "BOOKED", // จองแล้ว
//   PAID = "PAID", // ชำระแล้ว
//   OCCUPIED = "OCCUPIED", // ใช้งานแล้ว
//   BLOCKED = "BLOCKED", // บล็อค (ไม่ให้จอง)
//   EMPTY = "EMPTY", // ช่องว่าง (ไม่ใช่ที่นั่ง)
// }

// export enum BookingStatus {
//   PENDING = "PENDING",
//   RESERVED = "RESERVED",
//   BOOKED = "BOOKED",
//   PAID = "PAID",
//   CONFIRMED = "CONFIRMED",
//   CANCELLED = "CANCELLED",
//   EXPIRED = "EXPIRED",
//   AVAILABLE = "AVAILABLE",
// }

// export enum StandingTicketType {
//   ADULT = "ADULT", // ผู้ใหญ่
//   CHILD = "CHILD", // เด็ก
// }

// export enum PaymentStatus {
//   PENDING = "PENDING",
//   PROCESSING = "PROCESSING", // กำลังตรวจสอบ
//   PAID = "PAID",
//   FAILED = "FAILED",
//   REFUNDED = "REFUNDED",
//   CANCELLED = "CANCELLED",
// }

// export enum AuditAction {
//   CREATE = "CREATE",
//   UPDATE = "UPDATE",
//   DELETE = "DELETE",
//   CANCEL = "CANCEL",
//   CONFIRM = "CONFIRM",
//   REFUND = "REFUND",
//   VIEW = "VIEW",
//   LOGIN = "LOGIN",
//   LOGOUT = "LOGOUT",
// }

// export enum NotificationType {
//   ORDER_CREATED = "ORDER_CREATED",
//   ORDER_PAID = "ORDER_PAID",
//   ORDER_CANCELLED = "ORDER_CANCELLED",
//   ORDER_EXPIRED = "ORDER_EXPIRED",
//   SEAT_ASSIGNED = "SEAT_ASSIGNED",
//   PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
//   SLIP_VERIFICATION = "SLIP_VERIFICATION",
// }

// export enum ReportType {
//   DAILY_SALES = "DAILY_SALES",
//   MONTHLY_SALES = "MONTHLY_SALES",
//   REFERRER_COMMISSION = "REFERRER_COMMISSION",
//   SEAT_UTILIZATION = "SEAT_UTILIZATION",
//   PAYMENT_METHODS = "PAYMENT_METHODS",
// }

// export enum ZoneType {
//   RINGSIDE = "RINGSIDE",
//   STADIUM = "STADIUM",
//   VIP = "VIP",
//   PREMIUM = "PREMIUM",
// }

// export enum DiscountType {
//   PERCENTAGE = "PERCENTAGE",
//   FIXED_AMOUNT = "FIXED_AMOUNT",
//   EARLY_BIRD = "EARLY_BIRD",
//   GROUP = "GROUP",
// }

// export enum AttendanceStatus {
//   PENDING = "PENDING", // ยังไม่เช็คอิน
//   CHECKED_IN = "CHECKED_IN", // เช็คอินแล้ว
//   NO_SHOW = "NO_SHOW", // ไม่มาร่วมงาน
// }
