<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white px-4 py-6"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            ตั้งค่าระบบ
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            จัดการการตั้งค่าทั่วไปของระบบ
          </p>
        </div>
        <button
          @click="saveAllSettings"
          class="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Icon icon="mdi:content-save" class="text-lg" />
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>

    <!-- Settings Tabs -->
    <div class="mb-8">
      <nav class="flex space-x-8 border-b border-white/20">
        <button
          v-for="tab in settingsTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300',
          ]"
        >
          <Icon :icon="tab.icon" class="inline mr-2" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- General Settings Tab -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h2 class="text-xl font-semibold text-white mb-6">การตั้งค่าทั่วไป</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ชื่อสนาม</label
            >
            <input
              v-model="settings.general.stadiumName"
              type="text"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >เว็บไซต์</label
            >
            <input
              v-model="settings.general.website"
              type="url"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >โทรศัพท์</label
            >
            <input
              v-model="settings.general.phone"
              type="tel"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >อีเมล</label
            >
            <input
              v-model="settings.general.email"
              type="email"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ที่อยู่</label
            >
            <textarea
              v-model="settings.general.address"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h3 class="text-lg font-semibold text-white mb-4">การตั้งค่าเวลา</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >เขตเวลา</label
            >
            <select
              v-model="settings.general.timezone"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
              <option value="UTC">UTC (UTC+0)</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >รูปแบบวันที่</label
            >
            <select
              v-model="settings.general.dateFormat"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Settings Tab -->
    <div v-if="activeTab === 'booking'" class="space-y-6">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h2 class="text-xl font-semibold text-white mb-6">การตั้งค่าการจอง</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >เวลาสำรองการจอง (นาที)</label
            >
            <input
              v-model.number="settings.booking.reservationTime"
              type="number"
              min="1"
              max="60"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >จำนวนตั๋วสูงสุดต่อคำสั่งซื้อ</label
            >
            <input
              v-model.number="settings.booking.maxTicketsPerOrder"
              type="number"
              min="1"
              max="20"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >จำนวนวันล่วงหน้าที่สามารถจองได้</label
            >
            <input
              v-model.number="settings.booking.advanceBookingDays"
              type="number"
              min="1"
              max="90"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-gray-300 text-sm font-medium mb-2"
              >ชั่วโมงปิดการจองก่อนการแข่งขัน</label
            >
            <input
              v-model.number="settings.booking.cutoffHours"
              type="number"
              min="1"
              max="48"
              class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="settings.booking.allowGuestBooking"
              type="checkbox"
              class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span class="text-gray-300"
              >อนุญาตให้ผู้ใช้ที่ไม่ได้สมัครสมาชิกจองตั๋วได้</span
            >
          </label>
        </div>
      </div>
    </div>

    <!-- Payment Settings Tab -->
    <div v-if="activeTab === 'payment'" class="space-y-6">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h2 class="text-xl font-semibold text-white mb-6">
          การตั้งค่าการชำระเงิน
        </h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              วิธีการชำระเงิน
            </h3>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <input
                    v-model="method.enabled"
                    type="checkbox"
                    class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <Icon :icon="method.icon" class="text-2xl" />
                  <span class="text-white">{{ method.name }}</span>
                </div>
                <button
                  v-if="method.enabled"
                  @click="configurePaymentMethod(method)"
                  class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  ตั้งค่า
                </button>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >ค่าธรรมเนียมการชำระเงิน (%)</label
              >
              <input
                v-model.number="settings.payment.serviceFee"
                type="number"
                step="0.1"
                min="0"
                max="10"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >สกุลเงิน</label
              >
              <select
                v-model="settings.payment.currency"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="THB">บาทไทย (THB)</option>
                <option value="USD">ดอลลาร์สหรัฐ (USD)</option>
                <option value="EUR">ยูโร (EUR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Settings Tab -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h2 class="text-xl font-semibold text-white mb-6">
          การตั้งค่าการแจ้งเตือน
        </h2>

        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-semibold text-white mb-4">
              การแจ้งเตือนอีเมล
            </h3>
            <div class="space-y-3">
              <label
                v-for="notification in emailNotifications"
                :key="notification.id"
                class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div>
                  <div class="text-white font-medium">
                    {{ notification.title }}
                  </div>
                  <div class="text-gray-300 text-sm">
                    {{ notification.description }}
                  </div>
                </div>
                <input
                  v-model="notification.enabled"
                  type="checkbox"
                  class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >SMTP Server</label
              >
              <input
                v-model="settings.notifications.smtpServer"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >SMTP Port</label
              >
              <input
                v-model.number="settings.notifications.smtpPort"
                type="number"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >อีเมลผู้ส่ง</label
              >
              <input
                v-model="settings.notifications.fromEmail"
                type="email"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >ชื่อผู้ส่ง</label
              >
              <input
                v-model="settings.notifications.fromName"
                type="text"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Security Settings Tab -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <div
        class="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6"
      >
        <h2 class="text-xl font-semibold text-white mb-6">
          การตั้งค่าความปลอดภัย
        </h2>

        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >จำนวนครั้งสูงสุดในการเข้าสู่ระบบที่ผิด</label
              >
              <input
                v-model.number="settings.security.maxLoginAttempts"
                type="number"
                min="3"
                max="10"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >เวลาล็อกบัญชี (นาที)</label
              >
              <input
                v-model.number="settings.security.lockoutDuration"
                type="number"
                min="5"
                max="60"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >อายุ Session (ชั่วโมง)</label
              >
              <input
                v-model.number="settings.security.sessionTimeout"
                type="number"
                min="1"
                max="24"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-gray-300 text-sm font-medium mb-2"
                >ความยาวรหัสผ่านขั้นต่ำ</label
              >
              <input
                v-model.number="settings.security.minPasswordLength"
                type="number"
                min="6"
                max="20"
                class="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div class="space-y-3">
            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="settings.security.requireTwoFactor"
                type="checkbox"
                class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="text-gray-300">บังคับใช้ 2FA สำหรับผู้ดูแลระบบ</span>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="settings.security.logSecurityEvents"
                type="checkbox"
                class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="text-gray-300">บันทึกเหตุการณ์ความปลอดภัย</span>
            </label>

            <label class="flex items-center space-x-3 cursor-pointer">
              <input
                v-model="settings.security.requireHttps"
                type="checkbox"
                class="rounded border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
              />
              <span class="text-gray-300">บังคับใช้ HTTPS</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";

// Page meta
definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "admin",
});

// Reactive data
const activeTab = ref("general");

const settingsTabs = [
  { id: "general", name: "ทั่วไป", icon: "mdi:cog" },
  { id: "booking", name: "การจอง", icon: "mdi:calendar-clock" },
  { id: "payment", name: "การชำระเงิน", icon: "mdi:credit-card" },
  { id: "notifications", name: "การแจ้งเตือน", icon: "mdi:bell" },
  { id: "security", name: "ความปลอดภัย", icon: "mdi:shield-check" },
];

const settings = ref({
  general: {
    stadiumName: "Patong Boxing Stadium",
    website: "https://patongboxing.com",
    phone: "076-344-222",
    email: "info@patongboxing.com",
    address:
      "198/4 ถนนราชอุทิศ 200 ปี ตำบลปาตอง อำเภอกะทู้ จังหวัดภูเก็ต 83150",
    timezone: "Asia/Bangkok",
    dateFormat: "DD/MM/YYYY",
  },
  booking: {
    reservationTime: 30,
    maxTicketsPerOrder: 10,
    advanceBookingDays: 30,
    cutoffHours: 2,
    allowGuestBooking: true,
  },
  payment: {
    serviceFee: 2.5,
    currency: "THB",
  },
  notifications: {
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    fromEmail: "noreply@patongboxing.com",
    fromName: "Patong Boxing Stadium",
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 8,
    minPasswordLength: 8,
    requireTwoFactor: false,
    logSecurityEvents: true,
    requireHttps: true,
  },
});

const paymentMethods = ref([
  {
    id: "credit_card",
    name: "บัตรเครดิต/เดบิต",
    icon: "mdi:credit-card",
    enabled: true,
  },
  { id: "qr_code", name: "QR Code Payment", icon: "mdi:qrcode", enabled: true },
  {
    id: "bank_transfer",
    name: "โอนเงินผ่านธนาคาร",
    icon: "mdi:bank-transfer",
    enabled: true,
  },
  { id: "cash", name: "เงินสด", icon: "mdi:cash", enabled: false },
  { id: "paypal", name: "PayPal", icon: "mdi:paypal", enabled: false },
]);

const emailNotifications = ref([
  {
    id: "booking_confirmation",
    title: "ยืนยันการจอง",
    description: "ส่งอีเมลยืนยันเมื่อมีการจองตั๋ว",
    enabled: true,
  },
  {
    id: "payment_received",
    title: "ยืนยันการชำระเงิน",
    description: "ส่งอีเมลยืนยันเมื่อได้รับการชำระเงิน",
    enabled: true,
  },
  {
    id: "event_reminder",
    title: "แจ้งเตือนการแข่งขัน",
    description: "ส่งอีเมลแจ้งเตือนก่อนการแข่งขัน",
    enabled: true,
  },
  {
    id: "cancellation",
    title: "การยกเลิก",
    description: "ส่งอีเมลแจ้งเมื่อมีการยกเลิกตั๋ว",
    enabled: true,
  },
  {
    id: "promotion",
    title: "โปรโมชั่น",
    description: "ส่งอีเมลโปรโมชั่นและข่าวสาร",
    enabled: false,
  },
]);

// Methods
const saveAllSettings = async () => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("บันทึกการตั้งค่าเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error saving settings:", error);
    alert("เกิดข้อผิดพลาดในการบันทึกการตั้งค่า");
  }
};

const configurePaymentMethod = (method) => {
  alert(`ตั้งค่า ${method.name} - ฟีเจอร์นี้จะเปิดใช้งานในเร็วๆ นี้`);
};

// SEO
useSeoMeta({
  title: "System Settings - Admin Panel",
  description: "Configure system settings and preferences",
});
</script>
