// ตัวเลือกกลางสำหรับ order status และ payment method

export const orderStatusOptions = [
  { value: undefined, label: "ทั้งหมด" },
  { value: "PENDING", label: "PENDING" },
  //   { value: "PENDING_SLIP", label: "PENDING SLIP" },
  { value: "PAID", label: "PAID" },
  { value: "CONFIRMED", label: "CONFIRMED" },
  { value: "CANCELLED", label: "CANCELLED" },
  { value: "EXPIRED", label: "EXPIRED" },
  { value: "BOOKED", label: "BOOKED" },
  //   { value: "REFUNDED", label: "REFUNDED" },
  //   { value: "NO_SHOW", label: "NO SHOW" },
];

export const paymentMethodOptions = [
  { value: undefined, label: "ทั้งหมด" },
  //   { value: "QR_CODE", label: "QR CODE" },
  { value: "CASH", label: "CASH" },
  //   { value: "BANK_TRANSFER", label: "BANK TRANSFER" },
  { value: "CREDIT_CARD", label: "CREDIT CARD" },
];
