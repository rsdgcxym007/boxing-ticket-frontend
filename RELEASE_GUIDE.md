# Release Guide

## การสร้าง Release ใหม่

### วิธีที่ 1: ใช้ Git Tags (แนะนำ)

1. **อัพเดทเวอร์ชัน:**
   ```bash
   npm run version:patch  # สำหรับ bug fixes (1.0.1 -> 1.0.2)
   npm run version:minor  # สำหรับ features ใหม่ (1.0.1 -> 1.1.0)
   npm run version:major  # สำหรับ breaking changes (1.0.1 -> 2.0.0)
   ```

2. **Push tags:**
   ```bash
   git push origin main --tags
   ```

3. **GitHub Actions จะทำงานอัตโนมัติ:**
   - Build สำหรับ macOS และ Windows
   - สร้าง Release ใน GitHub
   - อัพโหลดไฟล์ติดตั้ง

### วิธีที่ 2: Manual Release

1. **ไปที่ GitHub Actions tab**
2. **เลือก "Build and Release Electron App"**
3. **คลิก "Run workflow"**
4. **ใส่เวอร์ชันที่ต้องการ (เช่น v1.0.3)**
5. **คลิก "Run workflow"**

## ไฟล์ที่จะถูกสร้าง

### macOS:
- `Patong Boxing Ticket System-{version}.dmg` - Installer
- `Patong Boxing Ticket System-{version}-mac.zip` - Portable
- `latest-mac.yml` - สำหรับ auto-update

### Windows:
- `Patong Boxing Ticket System Setup {version}.exe` - Installer (NSIS)
- `Patong Boxing Ticket System {version}.exe` - Portable
- `latest.yml` - สำหรับ auto-update

## Auto-Update

แอปจะตรวจสอบอัพเดทอัตโนมัติทุกครั้งที่เปิด:

1. **ตรวจสอบ Release ใหม่จาก GitHub**
2. **แจ้งเตือนผู้ใช้เมื่อมีอัพเดท**
3. **ดาวน์โหลดในพื้นหลัง**
4. **แจ้งให้รีสตาร์ทเพื่อติดตั้ง**

## การทดสอบ

### ทดสอบการ Build:
```bash
npm run generate
npm run electron:dist:mac
npm run electron:dist:win
```

### ทดสอบ Auto-Update:
1. สร้าง Release เวอร์ชันเก่า
2. ติดตั้งแอป
3. สร้าง Release เวอร์ชันใหม่
4. เปิดแอปเวอร์ชันเก่า
5. ตรวจสอบการแจ้งเตือนอัพเดท

## การแก้ไขปัญหา

### Build ล้มเหลว:
- ตรวจสอบ Dependencies
- ตรวจสอบ disk space
- ตรวจสอบ electron-builder config

### Auto-Update ไม่ทำงาน:
- ตรวจสอบ GitHub repository settings
- ตรวจสอบ publish configuration
- ตรวจสอบ latest.yml files

## Security

- Code signing ถูกปิดไว้ใน development
- Production ควรมี valid certificates
- Auto-update ใช้ HTTPS จาก GitHub

## การตั้งค่า GitHub Repository

1. **ไปที่ Settings > Actions > General**
2. **เลือก "Read and write permissions" สำหรับ GITHUB_TOKEN**
3. **Save การตั้งค่า**

## เวอร์ชันปัจจุบัน

- **v1.0.2** - เพิ่ม auto-update และ multi-platform builds
