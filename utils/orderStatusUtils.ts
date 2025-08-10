// Helper functions for order status and UI logic
import { OrderStatus, TicketType, OrderPurchaseType } from "@/types/Enums";

export const getStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      class: "bg-white border border-yellow-400 text-yellow-900 font-bold",
      label: "รอดำเนินการ",
      icon: "mdi-clock-outline text-yellow-700 text-base",
    },
    BOOKED: {
      class: "bg-white border border-blue-400 text-blue-900 font-bold",
      label: "จองแล้ว",
      icon: "mdi-bookmark text-blue-700 text-base",
    },
    PAID: {
      class: "bg-white border border-green-400 text-green-900 font-bold",
      label: "ชำระแล้ว",
      icon: "mdi-ticket-confirmation-outline text-green-700 text-base",
    },
    CANCELLED: {
      class: "bg-white border border-red-400 text-red-900 font-bold",
      label: "ยกเลิกแล้ว",
      icon: "mdi-cancel text-red-700 text-base",
    },
    CONFIRMED: {
      class: "bg-white border border-emerald-400 text-emerald-900 font-bold",
      label: "ยืนยันแล้ว",
      icon: "mdi-check-all text-emerald-700 text-base",
    },
    EXPIRED: {
      class: "bg-white border border-gray-400 text-gray-900 font-bold",
      label: "หมดอายุ",
      icon: "mdi-timer-off text-gray-700 text-base",
    },
    PARTIAL_ORDER: {
      class: "bg-white border border-yellow-400 text-yellow-900 font-bold",
      label: "จ่ายเงินบางส่วน",
      icon: "mdi-clock-outline text-yellow-700 text-base",
    },
  };
  return (
    configs[status] || {
      class: "bg-white border border-gray-400 text-gray-900 font-bold",
      label: "ไม่ทราบสถานะ",
      icon: "mdi-help text-gray-700 text-base",
    }
  );
};

export const getPaymentStatusConfig = (status: string) => {
  const configs = {
    PENDING: {
      class: "bg-white border border-orange-400 text-orange-900 font-bold",
      label: "รอการชำระ",
      icon: "mdi-clock-outline text-orange-700 text-base",
    },
    PAID: {
      class: "bg-white border border-green-400 text-green-900 font-bold",
      label: "ชำระแล้ว",
      icon: "mdi-cash-check text-green-700 text-base",
    },
    FAILED: {
      class: "bg-white border border-red-400 text-red-900 font-bold",
      label: "ชำระไม่สำเร็จ",
      icon: "mdi-close-circle text-red-700 text-base",
    },
    REFUNDED: {
      class: "bg-white border border-purple-400 text-purple-900 font-bold",
      label: "คืนเงินแล้ว",
      icon: "mdi-cash-refund text-purple-700 text-base",
    },
    PARTIAL: {
      class: "bg-white border border-yellow-400 text-yellow-900 font-bold",
      label: "ชำระบางส่วน",
      icon: "mdi-clock-outline text-yellow-700 text-base",
    },
  };
  return (
    configs[status] || {
      class: "bg-white border border-gray-400 text-gray-900 font-bold",
      label: "ไม่ทราบสถานะ",
      icon: "mdi-help text-gray-700 text-base",
    }
  );
};

export const getTicketTypeConfig = (ticketType: string) => {
  const configs = {
    RINGSIDE: {
      label: "ริงไซด์",
      icon: "mdi-crown",
      color: "text-yellow-400",
    },
    STADIUM: {
      label: "สเตเดียม",
      icon: "mdi-stadium",
      color: "text-blue-400",
    },
    STANDING: {
      label: "ตั๋วยืน",
      icon: "mdi-human-queue",
      color: "text-green-400",
    },
  };
  return (
    configs[ticketType] || {
      label: ticketType,
      icon: "mdi-ticket",
      color: "text-gray-400",
    }
  );
};

export const getPurchaseTypeConfig = (purchaseType: string) => {
  const configs = {
    WEBSITE: {
      label: "เว็บไซต์",
      icon: "mdi-web",
      color: "text-blue-400",
    },
    BOOKING: {
      label: "จองล่วงหน้า",
      icon: "mdi-calendar-check",
      color: "text-purple-400",
    },
    ONSITE: {
      label: "หน้างาน",
      icon: "mdi-store",
      color: "text-orange-400",
    },
  };
  return (
    configs[purchaseType] || {
      label: purchaseType,
      icon: "mdi mdi-help",
      color: "text-gray-400",
    }
  );
};

// Logic to determine what fields can be edited
export const canEditField = (orderData: any, field: string): boolean => {
  if (!orderData) return false;

  const { ticketType, purchaseType, status, paymentStatus } = orderData;

  // STANDING + ONSITE: Cannot edit anything
  if (
    ticketType === TicketType.STANDING &&
    purchaseType === OrderPurchaseType.ONSITE
  ) {
    return false;
  }

  // STANDING + BOOKING: Can edit everything except when PAID
  if (
    ticketType === TicketType.STANDING &&
    purchaseType === OrderPurchaseType.BOOKING
  ) {
    // Cannot edit if both status and paymentStatus are PAID
    if (status === OrderStatus.PAID && paymentStatus === "PAID") {
      return false;
    }
    // Can edit everything else (but not seats since it's STANDING)
    if (field === "seatIds" || field === "newSeatIds") {
      return false;
    }
    return true;
  }

  // RINGSIDE (any purchaseType): Can edit everything, including seats
  if (ticketType === TicketType.RINGSIDE) {
    // newShowDate can always be edited for RINGSIDE
    if (field === "newShowDate") return true;

    // seatIds can always be edited for RINGSIDE (but with quantity restrictions)
    if (field === "seatIds" || field === "newSeatIds") return true;

    // For PAID orders, can edit seats, date, and basic customer info
    if (status === OrderStatus.PAID && paymentStatus === "PAID") {
      return [
        "seatIds",
        "newSeatIds",
        "newShowDate",
        "newReferrerCode",
        "newCustomerName",
        "newCustomerPhone",
        "newCustomerEmail",
      ].includes(field);
    }

    // Non-PAID RINGSIDE orders can edit everything
    return true;
  }

  // Default fallback: can edit most things for non-PAID orders
  if (status !== OrderStatus.PAID || paymentStatus !== "PAID") {
    return true;
  }

  return false;
};

// Logic to determine what fields should be visible
export const shouldShowField = (orderData: any, fieldName: string): boolean => {
  if (!orderData) return false;

  const { purchaseType, ticketType } = orderData;

  // ONSITE purchases don't show customer info
  if (purchaseType === OrderPurchaseType.ONSITE) {
    if (
      [
        "customerName",
        "customerPhone",
        "email",
        "newCustomerName",
        "newCustomerPhone",
        "newCustomerEmail",
      ].includes(fieldName)
    ) {
      return false;
    }
  }

  // Standing tickets don't have seats
  if (ticketType === TicketType.STANDING) {
    if (["seats", "seatIds", "newSeatIds"].includes(fieldName)) {
      return false;
    }
  }

  return true;
};

export const shouldShowSeatsSection = (orderData: any): boolean => {
  return (
    orderData?.ticketType !== TicketType.STANDING &&
    orderData?.seats?.length > 0
  );
};

export const shouldShowCustomerSection = (orderData: any): boolean => {
  return orderData?.purchaseType !== OrderPurchaseType.ONSITE;
};

export const shouldShowStandingSection = (orderData: any): boolean => {
  return (
    orderData?.ticketType === TicketType.STANDING &&
    (orderData?.standingAdultQty > 0 || orderData?.standingChildQty > 0)
  );
};
