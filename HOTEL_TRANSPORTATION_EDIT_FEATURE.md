# Hotel & Transportation Edit Feature Implementation

## Overview
เพิ่มฟีเจอร์การแก้ไขข้อมูลโรงแรมและการขนส่งในหน้าแก้ไขออเดอร์ สำหรับระบบ Boxing Ticket Management

## Files Modified

### 1. `/pages/admin/order/[id]/edit.vue`
**การเปลี่ยนแปลง:**
- เพิ่มฟิลด์ใหม่ในส่วน Form data (formData) สำหรับโรงแรมและการขนส่ง
- เพิ่มฟิลด์ใหม่ในรายการ editableFields
- อัปเดต loadOrder() เพื่อโหลดข้อมูลใหม่
- เพิ่มส่วน UI สำหรับแสดงและแก้ไขข้อมูลโรงแรมและการขนส่ง
- อัปเดตการเรียกใช้ changeSeats() เพื่อส่งข้อมูลใหม่

**ฟิลด์ที่เพิ่มใหม่:**
```javascript
// Hotel Information
hotelName: "",
hotelDistrict: "", 
roomNumber: "",

// Passenger Information
adultCount: 0,
childCount: 0,
infantCount: 0,
bookerName: "",

// Voucher Information
voucherNumber: "",
voucherCode: "",
referenceNo: "",

// Transportation Information
pickupScheduledTime: "",
includesPickup: false,
includesDropoff: false,
requiresPickup: false,
requiresDropoff: false,
pickupHotel: "",
dropoffLocation: "",
pickupTime: "",
dropoffTime: "",
specialRequests: "",
```

**UI Sections ที่เพิ่ม:**
1. **Hotel Information** - ข้อมูลโรงแรม (3 columns grid)
2. **Passenger Information** - จำนวนผู้โดยสาร (4 columns grid)
3. **Voucher Information** - ข้อมูลบัตรกำนัล (3 columns grid)
4. **Transportation Information** - ข้อมูลการขนส่ง (2 columns grid แบ่งเป็น Pickup/Dropoff)
5. **Special Requests** - คำขอพิเศษ (textarea)

### 2. `/composables/useOrder.ts`
**การเปลี่ยนแปลง:**
- อัปเดตฟังก์ชัน changeSeats() เพื่อรองรับพารามิเตอร์ใหม่ทั้งหมด
- เพิ่มการส่งข้อมูลโรงแรมและการขนส่งไปยัง API

**Signature ใหม่:**
```typescript
const changeSeats = async (
  orderId: string,
  seatIds: string[],
  newReferrerCode?: string,
  newCustomerName?: string,
  newCustomerPhone?: string,
  newCustomerEmail?: string,
  newShowDate?: string,
  newSource?: string,
  // Hotel & Transportation fields
  hotelName?: string,
  hotelDistrict?: string,
  roomNumber?: string,
  adultCount?: number,
  childCount?: number,
  infantCount?: number,
  voucherNumber?: string,
  pickupScheduledTime?: string,
  bookerName?: string,
  includesPickup?: boolean,
  includesDropoff?: boolean,
  requiresPickup?: boolean,
  requiresDropoff?: boolean,
  pickupHotel?: string,
  dropoffLocation?: string,
  pickupTime?: string,
  dropoffTime?: string,
  voucherCode?: string,
  referenceNo?: string,
  specialRequests?: string
)
```

## Features Details

### User Experience
1. **Responsive Design** - รองรับทุกขนาดหน้าจอด้วย Tailwind responsive classes
2. **Conditional Editing** - ใช้ canEditField() เพื่อควบคุมการแก้ไขตามสถานะออเดอร์
3. **Visual Organization** - แบ่งข้อมูลเป็นหมวดหมู่ชัดเจนด้วยไอคอนและสี
4. **Checkbox Controls** - ใช้ checkbox สำหรับ boolean fields (includesPickup, includesDropoff, etc.)
5. **Time Inputs** - ใช้ input type="time" สำหรับฟิลด์เวลา

### Data Flow
```
User Input → formData → changeSeats() → API → Database
           ↓
Load Order → API Response → formData → UI Display
```

### Security & Validation
- ใช้ middleware "only-admin-staff" สำหรับการป้องกันการเข้าถึง
- ใช้ canEditField() เพื่อควบคุมสิทธิ์การแก้ไข
- รองรับ optional parameters ใน API call

### Styling & Layout
- **Color Scheme**: Blue theme สอดคล้องกับระบบ
- **Icons**: Material Design Icons (MDI) สำหรับทุกหมวดหมู่
- **Layout**: Grid responsive system
- **Spacing**: Consistent padding และ margins

## API Requirements
Backend ต้องอัปเดต endpoint `/api/v1/orders/:id/change-seats` เพื่อรองรับฟิลด์ใหม่:

```json
{
  "seatIds": ["..."],
  "newReferrerCode": "...",
  "newCustomerName": "...",
  "newCustomerPhone": "...",
  "newCustomerEmail": "...",
  "newShowDate": "...",
  "newSource": "...",
  "hotelName": "...",
  "hotelDistrict": "...",
  "roomNumber": "...",
  "adultCount": 0,
  "childCount": 0,
  "infantCount": 0,
  "voucherNumber": "...",
  "pickupScheduledTime": "...",
  "bookerName": "...",
  "includesPickup": true,
  "includesDropoff": true,
  "requiresPickup": false,
  "requiresDropoff": false,
  "pickupHotel": "...",
  "dropoffLocation": "...",
  "pickupTime": "...",
  "dropoffTime": "...",
  "voucherCode": "...",
  "referenceNo": "...",
  "specialRequests": "..."
}
```

## Testing Status
- ✅ Build Success - No compilation errors
- ✅ TypeScript Validation - All types resolved
- ✅ UI Components - All base components imported correctly
- ✅ Responsive Design - Mobile-first approach implemented

## Next Steps
1. Backend API update เพื่อรองรับฟิลด์ใหม่
2. Database schema update (ถ้าจำเป็น)
3. Testing การทำงานของฟอร์มในสภาพแวดล้อมจริง
4. User acceptance testing

---
สร้างเมื่อ: $(date)
ผู้พัฒนา: GitHub Copilot
