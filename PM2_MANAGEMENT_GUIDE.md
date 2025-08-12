# PM2 Duplicate Process Management Guide

## ปัญหาที่พบ
การที่ PM2 สร้าง process ซ้ำกันเกิดจากสาเหตุหลายประการ:

1. **Cluster Mode**: การตั้งค่า `instances: "max"` และ `exec_mode: "cluster"` ทำให้สร้าง instance หลายตัว
2. **Process เก่าไม่ถูก cleanup**: มี process เก่าๆ ที่ยังไม่ได้ stop/delete อย่างถูกต้อง
3. **การ deploy ซ้อนกัน**: การรัน deploy script หลายครั้งโดยไม่ cleanup ก่อน
4. **Port conflict**: มี process อื่นใช้ port 3000 อยู่

## การแก้ไขที่ทำไว้

### 1. แก้ไข ecosystem.config.cjs
```javascript
// เปลี่ยนจาก
instances: "max",
exec_mode: "cluster",

// เป็น  
instances: 1,
exec_mode: "fork",
```

### 2. Scripts ที่สร้างขึ้น

#### `pre-deploy-cleanup.sh`
- รันก่อน deployment ทุกครั้ง
- ทำ cleanup process เก่าทั้งหมด
- ตรวจสอบ port 3000 ว่าง
- บังคับ kill zombie processes

#### `pm2-health-check.sh` 
- ตรวจสอบสถานะ PM2 แบบละเอียด
- นับจำนวน process และเปรียบเทียบกับที่ต้องการ
- แสดงข้อมูล memory, CPU usage
- ตรวจหา zombie processes

#### `fix-pm2-duplicates.sh` (ปรับปรุง)
- แก้ไขปัญหา duplicate processes
- Remove ทุก process ที่เกี่ยวข้องกับ boxing-ticket-frontend
- ทำ cleanup อย่างละเอียด

#### `cleanup-pm2.sh` 
- Cleanup แบบปลอดภัย เฉพาะ boxing-ticket-frontend
- ไม่กระทบ PM2 apps อื่นๆ

### 3. การแก้ไข deploy.sh
- เพิ่มการรัน `pre-deploy-cleanup.sh` ก่อน start PM2
- ใช้ `pm2 start` แทน `pm2 reload` เพื่อให้แน่ใจว่าเป็น fresh start

## วิธีการใช้งาน

### ตรวจสอบสถานะปัจจุบัน
```bash
./pm2-health-check.sh
```

### แก้ไขปัญหา duplicates
```bash
./fix-pm2-duplicates.sh
```

### Cleanup ก่อน deploy ใหม่
```bash
./pre-deploy-cleanup.sh
```

### Deploy แบบปลอดภัย
```bash
./deploy.sh
```

## การป้องกันปัญหาในอนาคต

### 1. ก่อน deploy ทุกครั้ง
```bash
# ตรวจสอบสถานะก่อน
./pm2-health-check.sh

# ถ้ามีปัญหา ให้ cleanup ก่อน
./pre-deploy-cleanup.sh

# จึงค่อย deploy
./deploy.sh
```

### 2. ตรวจสอบหลัง deploy
```bash
# ตรวจสอบว่า deploy สำเร็จ
./pm2-health-check.sh

# ดู PM2 status
pm2 list
pm2 logs boxing-ticket-frontend --lines 50
```

### 3. Monitoring
```bash
# ตรวจสอบ resource usage
pm2 monit

# ดู logs real-time
pm2 logs boxing-ticket-frontend

# ดู process details
pm2 show boxing-ticket-frontend
```

## แก้ไขปัญหาเฉพาะหน้า

### หาก port 3000 ถูกใช้อยู่
```bash
# หา process ที่ใช้ port 3000
lsof -i:3000

# kill process นั้น
kill -9 <PID>
```

### หาก PM2 ไม่ตอบสนอง
```bash
# Restart PM2 daemon
pm2 kill
pm2 ping

# Start application ใหม่
pm2 start ecosystem.config.cjs --env production
```

### หาก memory leak
```bash
# Restart application
pm2 restart boxing-ticket-frontend

# หรือ reload (graceful restart)
pm2 reload boxing-ticket-frontend
```

## Best Practices

1. **ใช้ single instance**: ไม่จำเป็นต้องใช้ cluster mode สำหรับ small-medium applications
2. **Regular cleanup**: รัน health check เป็นประจำ
3. **Monitor resources**: ใช้ `pm2 monit` ตรวจสอบ CPU/Memory
4. **Log management**: ใช้ `pm2 flush` ลบ logs เก่าเป็นระยะ
5. **Systematic deployment**: ทำตาม process cleanup → deploy → verify

## Scripts Summary

| Script | Purpose | เมื่อไหร่ควรใช้ |
|--------|---------|-----------------|
| `pm2-health-check.sh` | ตรวจสอบสถานะทั่วไป | ก่อน/หลัง deploy, เมื่อสงสัยว่ามีปัญหา |
| `pre-deploy-cleanup.sh` | Cleanup ก่อน deploy | ก่อน deploy ทุกครั้ง |
| `fix-pm2-duplicates.sh` | แก้ไข duplicates | เมื่อพบ duplicate processes |
| `cleanup-pm2.sh` | Cleanup ปลอดภัย | เมื่อต้องการ clean reset |
| `deploy.sh` | Deploy application | เมื่อต้องการ deploy ใหม่ |
