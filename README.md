# 🎯 Boxing Ticket Frontend - Clean Architecture

## 📋 What's New
✅ **Removed Nuxt UI** - ลบ Nuxt UI ออกจากระบบทั้งหมด  
✅ **Custom Base Components** - สร้าง Base Components ที่เรียบง่าย ใช้งานง่าย  
✅ **TypeScript Support** - เพิ่ม TypeScript support ที่สมบูรณ์  
✅ **Better Code Organization** - จัดโครงสร้างโค้ดให้ง่ายต่อการดูและดูแล  
✅ **Performance Improved** - ลดขนาด bundle และเพิ่มประสิทธิภาพ  

## 🚀 Quick Start

### Installation
```bash
npm install
npm run dev
```

### Development
```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture Overview

### Tech Stack
- **Framework**: Nuxt 3 (Vue 3 + TypeScript)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Icons**: FontAwesome + MDI
- **HTTP Client**: Custom useApi composable
- **Real-time**: Socket.io
- **Internationalization**: @nuxtjs/i18n

## 🎨 Base Components

### Available Components
1. **BaseButton** - ปุ่มที่ใช้งานได้หลากหลาย
2. **BaseInput** - Input field พร้อม validation
3. **BaseModal** - Modal dialog ที่ใช้งานง่าย
4. **BaseCard** - Card container สำหรับแสดงข้อมูล
5. **BaseAlert** - Alert messages แบบต่างๆ
6. **BaseSpinner** - Loading spinner

### Usage Examples
```vue
<template>
  <!-- Button -->
  <BaseButton 
    variant="primary" 
    size="lg" 
    @click="handleClick"
  >
    จองตั๋ว
  </BaseButton>
  
  <!-- Input -->
  <BaseInput 
    v-model="customerName"
    label="ชื่อลูกค้า"
    :required="true"
    :error="errors.name"
  />
  
  <!-- Modal -->
  <BaseModal 
    :isOpen="showModal"
    title="ยืนยันการจอง"
    @close="closeModal"
  >
    <p>คุณต้องการจองตั๋วใช่หรือไม่?</p>
  </BaseModal>
</template>
```

## 📱 Features

### 🎫 Ticket Booking
- **Standing Tickets**: จองตั๋วยืนพร้อมคำนวณราคา
- **Seated Tickets**: จองตั๋วนั่งพร้อมเลือกที่นั่ง
- **Zone Selection**: เลือกโซนที่นั่งต่างๆ
- **Real-time Updates**: อัพเดทสถานะแบบ real-time

### 💳 Payment Processing
- **Multiple Payment Methods**: QR Code, Bank Transfer, Credit Card
- **Payment Slip Upload**: อัพโหลดสลิปการโอนเงิน
- **SCB Integration**: เชื่อมต่อกับระบบธนาคาร SCB
- **Payment Verification**: ตรวจสอบการชำระเงิน

### 📊 Admin Dashboard
- **Order Management**: จัดการคำสั่งซื้อ
- **Sales Analytics**: วิเคราะห์ยอดขาย
- **Customer Management**: จัดการข้อมูลลูกค้า
- **Referrer Analytics**: วิเคราะห์ผู้แนะนำ

---

**🎉 Ready to build amazing ticket booking experiences!**
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
