# macOS Code Signature Fix

## ปัญหาที่พบ
```
Code signature at URL file:///Users/user/Library/Caches/com.patongboxing.ticket.app.ShipIt/update.POsWqFU/Patong%20Boxing%20Ticket%20System.app/ did not pass validation: code has no resources but signature indicates they must be present
```

## สาเหตุของปัญหา
1. ไฟล์ `entitlements.mac.plist` ว่างเปล่า
2. การตั้งค่า code signing ไม่สมบูรณ์ใน electron-builder.json
3. ขาด environment variables สำหรับการ disable code signing ใน development

## วิธีแก้ไข

### 1. อัปเดต entitlements.mac.plist
ไฟล์นี้ได้ถูกสร้างขึ้นใหม่พร้อม entitlements ที่จำเป็น:
- Network access (client/server)
- File system access
- Device permissions
- JIT compilation สำหรับ Electron

### 2. ปรับปรุง electron-builder.json
เพิ่มการตั้งค่า:
- `identity: null` - ปิดการใช้ certificate ในการ build
- `notarize: false` - ปิดการ notarize สำหรับ development
- `minimumSystemVersion: "10.15"` - กำหนด macOS version ต่ำสุด
- `darkModeSupport: true` - รองรับ dark mode

### 3. ปรับปรุง GitHub Actions
เพิ่ม environment variables:
```yaml
env:
  CSC_IDENTITY_AUTO_DISCOVERY: false
  CSC_LINK: ''
  CSC_KEY_PASSWORD: ''
  APPLE_ID: ''
  APPLE_ID_PASS: ''
  APPLE_TEAM_ID: ''
```

### 4. สร้าง Build Scripts
- `scripts/build-mac.sh` - Script สำหรับ build ใน local
- `npm run build:mac:safe` - คำสั่งใหม่สำหรับ build อย่างปลอดภัย

## วิธีใช้งาน

### สำหรับ Development (Local Build)
```bash
# ใช้ script ที่สร้างไว้
npm run build:mac:safe

# หรือใช้คำสั่งโดยตรง
npm run electron:dist:mac
```

### สำหรับ Production Release
GitHub Actions จะจัดการให้อัตโนมัติเมื่อสร้าง tag ใหม่:
```bash
git tag v1.0.7
git push origin v1.0.7
```

## การตรวจสอบ
หลังจาก build เสร็จ ให้ตรวจสอบ:
1. ไฟล์ `.app` ใน `dist-electron/mac/`
2. ไฟล์ `.dmg` และ `.zip` ใน `dist-electron/`
3. ทดสอบการติดตั้งและรันแอป

## หมายเหตุ
- การปิด code signing จะทำให้ macOS ขึ้นเตือน "App is from unidentified developer"
- ผู้ใช้ต้องอนุญาตการรันในการเปิดครั้งแรก (Right-click > Open)
- สำหรับ production จริง ควรใช้ Apple Developer Certificate
