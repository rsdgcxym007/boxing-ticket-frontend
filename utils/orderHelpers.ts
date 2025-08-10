import dayjs from "dayjs";
import { TicketType } from "@/types/Enums";

// Format currency with comma separator
export const formatCurrency = (amount: number | string): string => {
  if (!amount) return "0";
  return Number(amount).toLocaleString();
};

// Format date to DD/MM/YYYY
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "ไม่ระบุ";
  return dayjs(dateStr).format("DD/MM/YYYY");
};

// Format time to HH:mm
export const formatTime = (dateStr: string): string => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("HH:mm");
};

// Format date and time to DD/MM/YYYY HH:mm
export const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return "ไม่ระบุ";
  return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
};

// Get ticket type label in Thai
export const getTicketTypeLabel = (type: string): string => {
  switch (type) {
    case "RINGSIDE":
      return "ริงไซด์";
    case "STADIUM":
      return "สนามกีฬา";
    case "STANDING":
      return "ยืน";
    default:
      return type || "ไม่ระบุ";
  }
};

// Get status label in Thai
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "BOOKED":
      return "จองแล้ว";
    case "PAID":
      return "ชำระแล้ว";
    case "CANCELLED":
      return "ยกเลิกแล้ว";
    case "EXPIRED":
      return "หมดอายุ";
    case "CONFIRMED":
      return "ยืนยันแล้ว";
    case "PARTIAL_ORDER":
      return "จ่ายเงินบางส่วน";
    default:
      return "ไม่ทราบสถานะ";
  }
};

// Get payment status label in Thai
export const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "รอการชำระ";
    case "PAID":
      return "ชำระแล้ว";
    case "FAILED":
      return "ชำระไม่สำเร็จ";
    case "REFUNDED":
      return "คืนเงินแล้ว";
    case "CANCELLED":
      return "ยกเลิกการชำระ";
    case "PARTIAL":
      return "ชำระบางส่วน";
    default:
      return "ไม่ทราบสถานะ";
  }
};

// Get payment method label in Thai
export const getPaymentMethodLabel = (method: string): string => {
  switch (method) {
    case "CASH":
      return "เงินสด";
    case "CREDIT_CARD":
      return "บัตรเครดิต";
    case "TRANSFER":
      return "โอนเงิน";
    case "QR":
      return "QR Code";
    case "BANK_TRANSFER":
      return "โอนผ่านธนาคาร";
    default:
      return method || "ไม่ระบุ";
  }
};

// Get source label in Thai
export const getSourceLabel = (source: string): string => {
  switch (source) {
    case "WEBSITE":
      return "เว็บไซต์";
    case "FACEBOOK":
      return "Facebook";
    case "LINE":
      return "LINE";
    case "PHONE":
      return "โทรศัพท์";
    case "WALK_IN":
      return "Walk-in";
    case "DIRECT":
      return "ตรง";
    case "OTHER":
      return "อื่นๆ";
    default:
      return source || "ไม่ระบุ";
  }
};

// Get purchase type label in Thai
export const getPurchaseTypeLabel = (type: string): string => {
  switch (type) {
    case "BOOKING":
      return "จอง";
    case "ONSITE":
      return "หน้างาน";
    case "ONLINE":
      return "ออนไลน์";
    default:
      return type || "ไม่ระบุ";
  }
};

// Get status CSS classes
export const getStatusClass = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "BOOKED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "PAID":
      return "bg-green-100 text-green-800 border-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
    case "EXPIRED":
      return "bg-gray-100 text-gray-800 border-gray-300";
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "PARTIAL_ORDER":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

// Get payment status CSS classes
export const getPaymentStatusClass = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "PAID":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-300";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
    case "PARTIA":
      return "bg-orange-100 text-orange-800 border-orange-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

// Get status dot color
export const getStatusDotColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400";
    case "BOOKED":
      return "bg-blue-400";
    case "PAID":
      return "bg-green-400";
    case "CANCELLED":
      return "bg-red-400";
    case "EXPIRED":
      return "bg-gray-400";
    case "CONFIRMED":
      return "bg-emerald-400";
    default:
      return "bg-gray-400";
  }
};

// Get payment status dot color
export const getPaymentStatusDotColor = (status: string): string => {
  switch (status) {
    case "PENDING":
      return "bg-orange-400";
    case "PAID":
      return "bg-green-400";
    case "FAILED":
      return "bg-red-400";
    case "REFUNDED":
      return "bg-purple-400";
    case "CANCELLED":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};

// Calculate commission based on ticket type
export const getCommission = (order: any): number => {
  if (order.ticketType === TicketType.RINGSIDE) {
    return order.referrerCommission || 0;
  } else if (order.ticketType === TicketType.STANDING) {
    return order.standingCommission || 0;
  }
  return 0;
};

// Get ticket details for display
export const getTicketDetails = (order: any): string => {
  if (order.ticketType === TicketType.STANDING) {
    const parts = [];
    if (order.standingAdultQty)
      parts.push(`ผู้ใหญ่: ${order.standingAdultQty}`);
    if (order.standingChildQty) parts.push(`เด็ก: ${order.standingChildQty}`);
    return parts.join(" | ") || "ตั๋วยืน";
  } else if (order.seats?.length) {
    if (order.seats.length <= 3) {
      return order.seats.map((s: any) => s.seatNumber).join(", ");
    } else {
      return `${order.seats
        .slice(0, 2)
        .map((s: any) => s.seatNumber)
        .join(", ")}... (+${order.seats.length - 2})`;
    }
  }
  return "ไม่มีที่นั่ง";
};

// Get zone information
export const getZoneInfo = (order: any): string => {
  if (order.seats?.length && order.seats[0]?.zone?.name) {
    return order.seats[0].zone.name.replace("-", " ").toUpperCase();
  }
  return order.ticketType === TicketType.STANDING ? "พื้นที่ยืน" : "ไม่ระบุโซน";
};

// Get net amount after commission
export const getNetAmount = (order: any): number => {
  const total = Number(order.totalAmount || order.standingTotal || 0);
  const commission = getCommission(order);
  return total - commission;
};

// Get pickup/hotel information
export const getPickupInfo = (order: any): string => {
  if (!order.includesPickup && !order.hotelName) return "ไม่มีการรับส่ง";

  const parts = [];
  if (order.hotelName) parts.push(order.hotelName);
  if (order.hotelDistrict) parts.push(order.hotelDistrict);
  if (order.roomNumber) parts.push(`ห้อง ${order.roomNumber}`);

  return parts.join(", ") || "มีการรับส่ง";
};
