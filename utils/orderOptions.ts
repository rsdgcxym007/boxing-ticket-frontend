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
