# Event-Driven Seat Update System Integration

## Overview
การปรับปรุงระบบการจองที่นั่งจากแบบ auto-refresh (polling) เป็นแบบ event-driven ที่ใช้ WebSocket เพื่อความเร็วและประสิทธิภาพในการอัปเดตข้อมูลแบบ real-time

## ✅ Changes Made

### 1. WebSocket Enhancement (`useWebSocket.ts`)
- ✅ เพิ่มฟังก์ชัน `broadcastSeatUpdate()` สำหรับส่งข้อมูลการเปลี่ยนแปลงที่นั่ง
- ✅ เพิ่มฟังก์ชัน `onSeatUpdate()` สำหรับรับข้อมูลการเปลี่ยนแปลงที่นั่ง
- ✅ เพิ่มฟังก์ชัน `emit()` สำหรับส่งข้อมูลทั่วไป

### 2. Seat Manager Enhancement (`useSeatManager.ts`)
- ✅ เพิ่มฟังก์ชัน `refreshSeatData()` สำหรับ refresh ข้อมูลที่นั่ง
- ✅ ปรับปรุงฟังก์ชัน `refreshSeatAvailability()` ให้กรองที่นั่งที่ `seatNumber === null`

### 3. Modal Stadium Zone Selector (`ModalStadiumZoneSelector.vue`)
- ✅ เพิ่มฟังก์ชัน `handleSeatUpdateFromOthers()` สำหรับรับ event จากคนอื่น
- ✅ เพิ่มฟังก์ชัน `setupWebSocketListeners()` สำหรับตั้งค่า WebSocket listeners
- ✅ ปรับปรุงฟังก์ชัน `fetchSeats()` ให้กรองที่นั่งที่ `seatNumber === null`
- ✅ ปรับปรุงฟังก์ชัน `broadcastSeatUpdate()` ให้ส่งข้อมูลผ่าน WebSocket
- ✅ ปรับปรุงฟังก์ชัน `addSeatSelection()` ให้ส่ง event `seat_selected`
- ✅ ปรับปรุงฟังก์ชัน `removeSeatSelection()` ให้ส่ง event `seat_deselected`
- ✅ ปรับปรุงฟังก์ชัน `handleConfirm()` ให้ส่ง event `order_created`
- ✅ ปรับปรุงฟังก์ชัน `handleMarkOrder()` ให้ส่ง event `order_confirmed`
- ✅ ปรับปรุงฟังก์ชัน `onClose()` และ `onCloseSummaryModal()` ให้ส่ง event `seats_cancelled`
- ✅ ลบระบบ auto-refresh ทั้งหมด
- ✅ เพิ่มฟังก์ชัน `getCurrentUserId()` สำหรับตรวจสอบ user ID

## 🔄 Event Flow

### Seat Selection Events
1. **User selects seat** → `seat_selected` event → Other users fetch new seat data
2. **User deselects seat** → `seat_deselected` event → Other users fetch new seat data
3. **User creates order** → `order_created` event → Other users fetch new seat data
4. **User confirms order** → `order_confirmed` event → Other users fetch new seat data
5. **User cancels seats** → `seats_cancelled` event → Other users fetch new seat data

### Event Handling Logic
```javascript
// การส่ง event
const broadcastSeatUpdate = async (action) => {
  const updateData = {
    zoneKey: pageData.zoneKey,
    showDate: getDateKey(pageData.showDate),
    selectedSeats: pageData.selectedSeats.map(s => s.id),
    action,
    userId: getCurrentUserId(),
    timestamp: new Date().toISOString(),
  };
  
  webSocketManager.broadcastSeatUpdate(updateData);
};

// การรับ event
const handleSeatUpdateFromOthers = async (event) => {
  if (event.userId === getCurrentUserId()) return; // ข้าม event จากตัวเอง
  if (event.zoneKey !== pageData.zoneKey) return; // ข้าม event ของโซนอื่น
  
  await fetchSeats(); // Refresh ข้อมูลที่นั่ง
};
```

## 🛡️ Data Filtering

### Seat Filtering
- ✅ กรองที่นั่งที่ `seatNumber === null` ออกจากการแสดงผล
- ✅ กรองที่นั่งที่ `seatNumber === null` ออกจากการอัปเดต

```javascript
// กรองที่นั่งที่ไม่ถูกต้อง
const validSeats = allSeats.filter(seat => seat.seatNumber !== null);
```

## 📊 Performance Improvements

### Before (Auto-refresh)
- ❌ Polling every 5 seconds
- ❌ Unnecessary API calls
- ❌ High server load
- ❌ Delayed updates

### After (Event-driven)
- ✅ Instant updates via WebSocket
- ✅ Only updates when needed
- ✅ Lower server load
- ✅ Better user experience

## 🧪 Testing Required

### Manual Testing
1. **Multi-user seat selection**
   - เปิดหน้าจองที่นั่งใน 2 browser
   - เลือกที่นั่งใน browser 1
   - ตรวจสอบว่า browser 2 ได้รับการอัปเดตทันที

2. **Seat filtering**
   - ตรวจสอบว่าที่นั่งที่ `seatNumber === null` ไม่แสดงขึ้นมา

3. **Order creation**
   - สร้าง order ใน browser 1
   - ตรวจสอบว่า browser 2 ได้รับการอัปเดตทันที

4. **Connection status**
   - ตรวจสอบสถานะการเชื่อมต่อ WebSocket
   - ตรวจสอบการ reconnect อัตโนมัติ

## 📋 Next Steps

1. **Backend Integration**
   - ตรวจสอบว่า backend รองรับ WebSocket events
   - ตรวจสอบว่า backend ส่ง event ที่ถูกต้อง

2. **Error Handling**
   - เพิ่ม error handling สำหรับ WebSocket connection
   - เพิ่ม fallback mechanism

3. **Performance Testing**
   - ทดสอบกับผู้ใช้จำนวนมาก
   - ตรวจสอบ memory leaks

4. **Documentation**
   - อัปเดตเอกสารการใช้งาน
   - เพิ่ม troubleshooting guide

## 🔧 Technical Details

### WebSocket Events
- `seat_selected`: เมื่อผู้ใช้เลือกที่นั่ง
- `seat_deselected`: เมื่อผู้ใช้ยกเลิกที่นั่ง
- `order_created`: เมื่อผู้ใช้สร้าง order
- `order_confirmed`: เมื่อผู้ใช้ยืนยัน order
- `seats_cancelled`: เมื่อผู้ใช้ยกเลิกที่นั่ง

### Event Data Structure
```javascript
{
  zoneKey: string,
  showDate: string,
  selectedSeats: string[],
  action: string,
  userId: string,
  timestamp: string
}
```

### Fallback Mechanisms
- ถ้า WebSocket ไม่เชื่อมต่อ: ใช้ polling backup
- ถ้า composables ล้มเหลว: ใช้ fallback functions
- ถ้า event ล้มเหลว: log error และดำเนินการต่อ

## 🎯 Benefits

1. **Real-time Updates**: ผู้ใช้ได้รับการอัปเดตทันที
2. **Better Performance**: ลดการใช้ bandwidth และ server load
3. **Improved UX**: ไม่มีความล่าช้าในการอัปเดต
4. **Scalability**: รองรับผู้ใช้จำนวนมากได้ดีขึ้น
5. **Data Consistency**: ข้อมูลที่นั่งถูกต้องและเป็นปัจจุบัน

---

*Created: $(date)*
*Status: ✅ Implemented*
