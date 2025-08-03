# ระบบ Auto-Update และการแจ้งเตือน

## 📋 ภาพรวมการทำงาน

ระบบ Auto-Update ของแอปพลิเคชัน Patong Boxing Ticket System ประกอบด้วยส่วนประกอบหลัก:

### 🔧 องค์ประกอบหลัก

1. **Main Process (electron/main.cjs)**
   - เชื่อมต่อกับ GitHub Releases
   - ตรวจสอบอัพเดทอัตโนมัติ
   - จัดการการดาวน์โหลดและติดตั้ง

2. **Renderer Process (components/ElectronUpdateNotification.vue)**
   - แสดงการแจ้งเตือนอัพเดท
   - UI สำหรับจัดการอัพเดท
   - Progress tracking

3. **IPC Communication (electron/preload.js)**
   - เชื่อมต่อระหว่าง main และ renderer
   - ส่งข้อมูลสถานะอัพเดท

## ⚙️ การตั้งค่า Auto-Updater

### ใน main.cjs:
```javascript
// Configuration
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

// GitHub Releases setup
autoUpdater.setFeedURL({
  provider: "github",
  owner: "rsdgcxym007",
  repo: "boxing-ticket-frontend",
  private: false,
});
```

### ตรวจสอบอัพเดท:
- เมื่อแอปเริ่มต้น: หลังจาก 3 วินาที
- ตรวจสอบซ้ำ: ทุก 2 ชั่วโมง
- การตรวจสอบแบบ manual: ผ่านเมนู "Help → ตรวจสอบอัพเดท"

## 🎯 ขั้นตอนการทำงาน

### 1. การตรวจสอบอัพเดท
```javascript
autoUpdater.on("checking-for-update", () => {
  // แสดงสถานะ "กำลังตรวจสอบ..."
});

autoUpdater.on("update-available", (info) => {
  // แสดงการแจ้งเตือนมีอัพเดทใหม่
  // แสดงรายละเอียดเวอร์ชั่น
});

autoUpdater.on("update-not-available", (info) => {
  // แสดงข้อความ "ใช้เวอร์ชันล่าสุดแล้ว"
  // ซ่อนการแจ้งเตือนหลัง 3 วินาที
});
```

### 2. การดาวน์โหลด
```javascript
autoUpdater.on("download-progress", (progressObj) => {
  // แสดง progress bar
  // อัพเดทข้อมูลความเร็วและเวลาที่เหลือ
});

autoUpdater.on("update-downloaded", (info) => {
  // แสดงปุ่ม "รีสตาร์ทและติดตั้ง"
});
```

### 3. การติดตั้ง
```javascript
autoUpdater.quitAndInstall();
// ปิดแอปและติดตั้งอัพเดท
```

## 🖥️ UI Components

### ElectronUpdateNotification.vue

#### สถานะต่างๆ:
- **checking**: กำลังตรวจสอบ
- **available**: มีอัพเดทใหม่
- **downloading**: กำลังดาวน์โหลด
- **downloaded**: พร้อมติดตั้ง
- **error**: เกิดข้อผิดพลาด
- **not-available**: ใช้เวอร์ชันล่าสุดแล้ว

#### ข้อมูลที่แสดง:
- เวอร์ชั่นใหม่
- Release notes
- ขนาดไฟล์
- วันที่ออกอัพเดท
- Progress การดาวน์โหลด
- ข้อผิดพลาด (ถ้ามี)

## 🔄 IPC Handlers

### ใน main.cjs:
```javascript
ipcMain.handle("check-for-updates", async () => {
  // ตรวจสอบอัพเดทแบบ manual
});

ipcMain.handle("download-update", () => {
  // เริ่มดาวน์โหลดอัพเดท
});

ipcMain.handle("install-update", () => {
  // ติดตั้งอัพเดท
});
```

### ใน preload.js:
```javascript
checkForUpdates: () => ipcRenderer.invoke("check-for-updates"),
downloadUpdate: () => ipcRenderer.invoke("download-update"),
installUpdate: () => ipcRenderer.invoke("install-update"),
onUpdateStatus: (callback) => ipcRenderer.on("update-status", callback),
```

## 📱 การใช้งาน

### ผู้ใช้ทั่วไป:
1. แอปจะตรวจสอบอัพเดทอัตโนมัติ
2. เมื่อมีอัพเดทใหม่ จะแสดงการแจ้งเตือน
3. คลิก "ดาวน์โหลดอัพเดท" เพื่อเริ่มดาวน์โหลด
4. คลิก "รีสตาร์ทและติดตั้ง" เมื่อดาวน์โหลดเสร็จ

### ผู้ดูแลระบบ:
1. ใช้เมนู "Help → ตรวจสอบอัพเดท" สำหรับการตรวจสอบแบบ manual
2. อัพโหลด release ใหม่ไปที่ GitHub Releases
3. แอปจะตรวจสอบและแสดงการแจ้งเตือนอัตโนมัติ

## 🚀 การเผยแพร่อัพเดท

### สำหรับนักพัฒนา:
```bash
# สร้าง release ใหม่
npm run build:electron:mac    # macOS
npm run build:electron:win    # Windows
npm run build:electron:linux  # Linux

# อัพโหลดไปยัง GitHub Releases
npm run release
```

### GitHub Releases:
1. สร้าง Tag ใหม่ตามเวอร์ชั่น (เช่น v1.0.16)
2. อัพโหลดไฟล์ .dmg, .exe, .AppImage
3. เขียน Release notes
4. Publish release

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย:

1. **ไม่สามารถตรวจสอบอัพเดทได้**
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
   - ตรวจสอบ GitHub repository settings

2. **ดาวน์โหลดไม่สำเร็จ**
   - ตรวจสอบพื้นที่ว่างในเครื่อง
   - ตรวจสอบ firewall/antivirus

3. **ติดตั้งไม่สำเร็จ**
   - ปิดแอปอื่นๆ ที่อาจขัดขวาง
   - รันในโหมด administrator (Windows)

### การ Debug:
```javascript
// เปิด debug logs
process.env.ELECTRON_ENABLE_LOGGING = true;

// ตรวจสอบ console logs
console.log("[Auto-Updater] Update check result:", result);
```

## 📈 การปรับปรุงในอนาคต

1. **Delta Updates**: ดาวน์โหลดเฉพาะส่วนที่เปลี่ยนแปลง
2. **Background Updates**: ดาวน์โหลดในพื้นหลัง
3. **Rollback Capability**: ย้อนกลับเวอร์ชั่นเก่าได้
4. **Update Channels**: แยก stable/beta/alpha
5. **Scheduled Updates**: กำหนดเวลาอัพเดท

---

**หมายเหตุ**: ระบบ auto-update จะทำงานเฉพาะใน production build เท่านั้น ไม่ทำงานใน development mode
