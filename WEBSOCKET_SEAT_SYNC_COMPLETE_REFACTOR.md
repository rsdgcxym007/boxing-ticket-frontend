# WebSocket Seat Synchronization Fix - Complete Refactor

## ปัญหาที่พบ
เมื่อผู้ใช้คนที่ 1 เลือกที่นั่งไว้ 3 ที่นั่ง และผู้ใช้คนที่ 2 เลือกที่นั่ง ระบบจะส่ง WebSocket event กลับมาทำให้:
- UI ของผู้ใช้คนที่ 1 รีเฟรชข้อมูลทั้งหมด
- ที่นั่งที่เลือกไว้ของผู้ใช้คนที่ 1 หายไป
- ไม่มีการแยกสถานะระหว่างที่นั่งที่ตัวเองเลือก กับที่นั่งที่คนอื่นล็อก

## แนวทางแก้ไข
สร้างระบบจัดการที่นั่งแบบ Real-time ใหม่ที่:
1. **รักษาสถานะที่นั่งแยกตามผู้ใช้**: แยกที่นั่งที่ตัวเองเลือก กับที่นั่งที่คนอื่นล็อก
2. **ไม่รีเฟรชข้อมูลทั้งหมด**: อัปเดตเฉพาะส่วนที่จำเป็น
3. **รักษาการเลือกของผู้ใช้**: ไม่ให้การเลือกหายไปเมื่อมี WebSocket event

## การ Refactor ที่ทำ

### 1. useRealTimeSeatManager.ts
**ไฟล์ใหม่**: จัดการสถานะที่นั่งแบบ Real-time

**ฟีเจอร์หลัก:**
- `mySelectedSeats`: ที่นั่งที่ผู้ใช้ปัจจุบันเลือก
- `otherUsersSelections`: ที่นั่งที่ผู้ใช้อื่นเลือก (แสดงเป็น locked)
- `bookedSeats`: ที่นั่งที่จองแล้ว
- `refreshSeatsWithoutLosingSelection()`: รีเฟรชข้อมูลโดยไม่ให้การเลือกหายไป

**การจัดการ WebSocket Event:**
```typescript
// แยกการจัดการตามประเภท event
handleOtherUserSeatSelection(event: WebSocketSeatEvent)
handleOtherUserSeatDeselection(event: WebSocketSeatEvent)
handleOtherUserCancellation(event: WebSocketSeatEvent)
```

**การรักษาสถานะ:**
```typescript
// Backup และ restore การเลือก
const mySelectionBackup = new Set(mySelectedSeats.value);
const othersSelectionBackup = new Map(otherUsersSelections.value);

// รีเฟรชข้อมูล
const freshSeats = await fetchFunction(zoneKey, showDate);
initializeSeats(freshSeats);

// คืนการเลือกถ้าที่นั่งยังมีอยู่และเลือกได้
mySelectionBackup.forEach(seatId => {
  if (allSeats.value.has(seatId) && canSelectSeat(seatId)) {
    mySelectedSeats.value.add(seatId);
  }
});
```

### 2. useIntegratedSeatBooking.ts
**ไฟล์ใหม่**: รวมระบบจองที่นั่งเข้าด้วยกัน

**ฟีเจอร์หลัก:**
- ผูก `useRealTimeSeatManager` เข้ากับ API และ WebSocket
- จัดการการเลือกที่นั่งผ่าน API
- ส่ง WebSocket events
- สร้างการจอง

**การจัดการ WebSocket:**
```typescript
const handleWebSocketEvent = (event: any) => {
  // ตรวจสอบโซนและวันที่
  if (eventData.zoneKey !== currentZoneKey.value || 
      eventData.showDate !== currentShowDate.value) {
    return;
  }

  // แปลงและส่งต่อไป seatManager
  const seatEvent: WebSocketSeatEvent = {
    action: eventData.action,
    userId: eventData.userId,
    seatIds: eventData.selectedSeats,
    zoneKey: eventData.zoneKey,
    showDate: eventData.showDate,
    timestamp: eventData.timestamp
  };

  seatManager.handleWebSocketEvent(seatEvent);
};
```

### 3. ModalStadiumZoneSelector.vue (Refactored)
**การเปลี่ยนแปลงหลัก:**

**ใช้ Composable ใหม่:**
```vue
<script setup>
import { useIntegratedSeatBooking } from "~/composables/useIntegratedSeatBooking";

const seatBookingSystem = useIntegratedSeatBooking();
const {
  isProcessing,
  isBookingInProgress,
  canProceedToBooking,
  seatManager,
  initializeSeats,
  clearAllSelections,
  createBooking
} = seatBookingSystem;
</script>
```

**UI ที่อัปเดต:**
```vue
<!-- ใช้ข้อมูลจาก seatManager -->
<div v-if="seatManager.selectedSeatCount.value > 0">
  <p>{{ seatManager.getSeatsSummary().seatNumbers }}</p>
  <p>{{ seatManager.totalPrice.value }} บาท</p>
</div>

<!-- ใช้ข้อมูลที่นั่งจาก seatManager -->
<SeatIcon
  :selectedSeats="seatManager.mySelectedSeats.value"
  @toggle="handleSeatToggle"
/>
```

**การจัดการ Event:**
```javascript
const handleSeatToggle = async (seat) => {
  const success = await seatBookingSystem.toggleSeat(seat);
  
  if (success) {
    // อัปเดต UI โดยไม่ต้องรีเฟรชทั้งหมด
    pageData.currentZoneSeats = buildSeatLayoutFromCoordinates(
      seatManager.allSeats.value
    );
  }
};
```

## ข้อดีของการ Refactor

### 1. **แก้ปัญหาการเลือกหายไป**
- ที่นั่งที่เลือกไว้จะไม่หายไปเมื่อมี WebSocket event
- ระบบจะรักษาสถานะการเลือกของแต่ละผู้ใช้แยกกัน

### 2. **ปรับปรุงประสิทธิภาพ**
- ไม่ต้องรีเฟรชข้อมูลทั้งหมดเมื่อมี WebSocket event
- อัปเดตเฉพาะส่วนที่จำเป็น

### 3. **UI/UX ที่ดีขึ้น**
- ผู้ใช้เห็นที่นั่งที่ตัวเองเลือกเป็นสีเขียว (selected)
- ผู้ใช้เห็นที่นั่งที่คนอื่นเลือกเป็นสีส้ม (locked)
- ไม่มีการกะพริบหรือหายไปของการเลือก

### 4. **โค้ดที่ดูแลรักษาได้**
- แยกความรับผิดชอบชัดเจน
- ใช้ TypeScript เพื่อความปลอดภัย
- มี Error Handling ที่ดี

## การทดสอบ

### ก่อนแก้ไข:
1. ผู้ใช้ A เลือกที่นั่ง 3 ที่นั่ง
2. ผู้ใช้ B เลือกที่นั่ง 1 ที่นั่ง
3. ❌ ที่นั่งที่ผู้ใช้ A เลือกไว้หายไป
4. ❌ UI ของผู้ใช้ A รีเฟรชทั้งหมด

### หลังแก้ไข:
1. ผู้ใช้ A เลือกที่นั่ง 3 ที่นั่ง
2. ผู้ใช้ B เลือกที่นั่ง 1 ที่นั่ง
3. ✅ ที่นั่งที่ผู้ใช้ A เลือกไว้ยังคงอยู่ (สีเขียว)
4. ✅ ที่นั่งที่ผู้ใช้ B เลือกแสดงเป็นสีส้ม (locked) ในหน้าจอผู้ใช้ A
5. ✅ UI ไม่กะพริบหรือรีเฟรชทั้งหมด

## ไฟล์ที่สร้างใหม่

1. **composables/useRealTimeSeatManager.ts** - จัดการสถานะที่นั่งแบบ Real-time
2. **composables/useIntegratedSeatBooking.ts** - รวมระบบจองที่นั่งเข้าด้วยกัน
3. **components/ModalStadiumZoneSelector.vue** - Refactored modal component

## ไฟล์ที่เก็บไว้
- **components/ModalStadiumZoneSelector_OLD.vue** - ไฟล์เดิมสำหรับ backup

## สรุป

การ refactor นี้แก้ไขปัญหาการเลือกที่นั่งหายไปเมื่อมี WebSocket event และปรับปรุงประสบการณ์ผู้ใช้โดยรวม ระบบใหม่มีความเสถียรมากขึ้น มีการจัดการสถานะที่ชัดเจน และสามารถรองรับการใช้งานหลายผู้ใช้พร้อมกันได้ดีขึ้น
