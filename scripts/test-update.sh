#!/bin/bash

echo "🔄 ทดสอบระบบ Auto-Update"
echo "================================"

# ตรวจสอบว่า Electron app กำลังทำงานอยู่หรือไม่
if pgrep -f "electron" > /dev/null; then
    echo "✅ Electron app กำลังทำงานอยู่"
else
    echo "❌ Electron app ไม่ได้ทำงาน กรุณาเริ่ม app ก่อน"
    exit 1
fi

echo ""
echo "📋 ขั้นตอนการทดสอบ:"
echo "1. เปิด Electron app"
echo "2. เข้าไปที่หน้า '/update-test' (สำหรับ admin)"
echo "3. กดปุ่ม 'ตรวจสอบอัพเดท'"
echo "4. ทดสอบการจำลองการดาวน์โหลด"

echo ""
echo "🔗 URLs สำหรับทดสอบ:"
echo "- Web: http://localhost:3000/update-test"
echo "- Electron: จะเปิดอัตโนมัติ"

echo ""
echo "🐛 การ Debug:"
echo "- เปิด DevTools ใน Electron"
echo "- ตรวจสอบ Console logs"
echo "- ดู Network tab สำหรับการเรียก GitHub API"

echo ""
echo "📦 GitHub Release ที่ต้องมี:"
echo "- Repository: rsdgcxym007/boxing-ticket-frontend"
echo "- Release tag: v1.0.4 หรือสูงกว่า"
echo "- Assets: ไฟล์ .dmg, .zip, .exe ตาม platform"

echo ""
echo "🎯 สิ่งที่ควรทดสอบ:"
echo "1. การตรวจสอบอัพเดทอัตโนมัติ"
echo "2. การแสดงสถานะการดาวน์โหลด"
echo "3. การแสดง Error messages"
echo "4. การติดตั้งอัพเดท"

echo ""
echo "🔧 หากเกิดปัญหา:"
echo "- ตรวจสอบ internet connection"
echo "- ตรวจสอบ GitHub repository access"
echo "- ตรวจสอบ release assets ใน GitHub"
echo "- ดู logs ใน terminal"
