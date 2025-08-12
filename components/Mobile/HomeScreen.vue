<template>
  <div class="mobile-home-screen">
    <!-- Header -->
    <div class="header">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            Patong Boxing
          </h1>
          <p class="text-gray-600 dark:text-gray-400">
            {{ greeting }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="showNotifications = true"
            class="relative p-2 bg-gray-100 dark:bg-gray-800 rounded-full"
          >
            <Icon
              icon="mdi:bell"
              class="text-xl text-gray-600 dark:text-gray-400"
            />
            <div
              v-if="unreadNotifications > 0"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
            >
              {{ unreadNotifications }}
            </div>
          </button>
          <button
            @click="showProfile = true"
            class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <Icon icon="mdi:account" class="text-xl text-white" />
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        การกระทำด่วน
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="navigateTo('/booking')"
          class="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg"
        >
          <Icon icon="mdi:ticket" class="text-3xl mb-2" />
          <div class="font-medium">จองตั๋ว</div>
          <div class="text-sm opacity-80">เลือกที่นั่งและจอง</div>
        </button>

        <button
          @click="showQRScanner = true"
          class="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg"
        >
          <Icon icon="mdi:qrcode-scan" class="text-3xl mb-2" />
          <div class="font-medium">สแกน QR</div>
          <div class="text-sm opacity-80">ตรวจสอบตั๋วและโปรโมชั่น</div>
        </button>

        <button
          @click="navigateTo('/my-tickets')"
          class="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg"
        >
          <Icon icon="mdi:ticket-account" class="text-3xl mb-2" />
          <div class="font-medium">ตั๋วของฉัน</div>
          <div class="text-sm opacity-80">ดูตั๋วที่จองไว้</div>
        </button>

        <button
          @click="navigateTo('/promotions')"
          class="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl shadow-lg"
        >
          <Icon icon="mdi:gift" class="text-3xl mb-2" />
          <div class="font-medium">โปรโมชั่น</div>
          <div class="text-sm opacity-80">ดูข้อเสนอพิเศษ</div>
        </button>
      </div>
    </div>

    <!-- Upcoming Events -->
    <div class="upcoming-events mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          การแข่งขันที่จะมาถึง
        </h2>
        <button
          @click="navigateTo('/events')"
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ดูทั้งหมด
        </button>
      </div>

      <div class="space-y-3">
        <div
          v-for="event in upcomingEvents"
          :key="event.id"
          class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:boxing-glove" class="text-2xl text-red-600" />
            </div>
            <div class="flex-1">
              <h3 class="font-medium text-gray-800 dark:text-white">
                {{ event.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {{ event.description }}
              </p>
              <div class="flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <Icon icon="mdi:calendar" />
                  {{ formatDate(event.date) }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon icon="mdi:clock" />
                  {{ event.time }}
                </span>
                <span class="flex items-center gap-1">
                  <Icon icon="mdi:currency-thb" />
                  {{ event.priceRange }}
                </span>
              </div>
            </div>
            <button
              @click="bookEvent(event)"
              class="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700"
            >
              จอง
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- My Tickets Summary -->
    <div class="my-tickets mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
          ตั๋วของฉัน
        </h2>
        <button
          @click="navigateTo('/my-tickets')"
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ดูทั้งหมด
        </button>
      </div>

      <div v-if="myTickets.length > 0" class="space-y-3">
        <div
          v-for="ticket in myTickets.slice(0, 2)"
          :key="ticket.id"
          class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-gray-800 dark:text-white">
                {{ ticket.eventName }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                ที่นั่ง: {{ ticket.seatNumber }} |
                {{ formatDate(ticket.eventDate) }}
              </p>
            </div>
            <div class="text-right">
              <div
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getStatusClass(ticket.status)"
              >
                {{ getStatusText(ticket.status) }}
              </div>
              <button
                @click="showTicketQR(ticket)"
                class="mt-1 text-blue-600 hover:text-blue-700 text-xs"
              >
                แสดง QR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <Icon icon="mdi:ticket-outline" class="text-4xl text-gray-400 mb-2" />
        <p class="text-gray-600 dark:text-gray-400">ยังไม่มีตั๋วที่จอง</p>
        <button
          @click="navigateTo('/booking')"
          class="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          จองตั๋วเลย
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="quick-stats mb-6">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        สถิติส่วนตัว
      </h2>
      <div class="grid grid-cols-3 gap-3">
        <div
          class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center"
        >
          <div class="text-2xl font-bold text-blue-600">
            {{ userStats.totalTickets }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">
            ตั๋วทั้งหมด
          </div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center"
        >
          <div class="text-2xl font-bold text-green-600">
            {{ userStats.totalSpent }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">ยอดใช้จ่าย</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center"
        >
          <div class="text-2xl font-bold text-purple-600">
            {{ userStats.favoriteZone }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">โซนโปรด</div>
        </div>
      </div>
    </div>

    <!-- QR Scanner Modal -->
    <div v-if="showQRScanner" class="fixed inset-0 bg-black/50 z-50">
      <div class="h-full overflow-y-auto">
        <QRScanner
          @close="showQRScanner = false"
          @scan-result="handleQRResult"
        />
      </div>
    </div>

    <!-- Notifications Modal -->
    <div
      v-if="showNotifications"
      class="fixed inset-0 bg-black/50 z-50 flex items-end"
    >
      <div
        class="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            การแจ้งเตือน
          </h3>
          <button
            @click="showNotifications = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
        <NotificationPanel @close="showNotifications = false" />
      </div>
    </div>

    <!-- Profile Modal -->
    <div
      v-if="showProfile"
      class="fixed inset-0 bg-black/50 z-50 flex items-end"
    >
      <div
        class="w-full bg-white dark:bg-gray-800 rounded-t-xl p-4 max-h-[80vh] overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            โปรไฟล์
          </h3>
          <button
            @click="showProfile = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Icon icon="mdi:close" class="text-xl" />
          </button>
        </div>
        <div class="space-y-4">
          <div class="text-center">
            <div
              class="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center"
            >
              <Icon icon="mdi:account" class="text-3xl text-white" />
            </div>
            <h4 class="text-xl font-semibold text-gray-800 dark:text-white">
              สมชาย ใจดี
            </h4>
            <p class="text-gray-600 dark:text-gray-400">somchai@example.com</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button
              @click="navigateTo('/profile')"
              class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
            >
              <Icon
                icon="mdi:account-edit"
                class="text-xl text-gray-600 dark:text-gray-400 mb-1"
              />
              <div class="text-sm">แก้ไขโปรไฟล์</div>
            </button>
            <button
              @click="navigateTo('/settings')"
              class="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center"
            >
              <Icon
                icon="mdi:cog"
                class="text-xl text-gray-600 dark:text-gray-400 mb-1"
              />
              <div class="text-sm">ตั้งค่า</div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket QR Modal -->
    <div
      v-if="showTicketQRModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
            QR Code ตั๋ว
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ selectedTicket?.eventName }}
          </p>
        </div>

        <div class="bg-white p-4 rounded-lg mb-4">
          <div
            class="w-48 h-48 mx-auto bg-gray-200 rounded-lg flex items-center justify-center"
          >
            <!-- QR Code would be generated here -->
            <Icon icon="mdi:qrcode" class="text-6xl text-gray-400" />
          </div>
        </div>

        <div class="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          แสดง QR Code นี้ที่หน้างานเพื่อเข้าชม
        </div>

        <button
          @click="showTicketQRModal = false"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import QRScanner from "./QRScanner.vue";
import NotificationPanel from "./NotificationPanel.vue";

// Reactive data
const showQRScanner = ref(false);
const showNotifications = ref(false);
const showProfile = ref(false);
const showTicketQRModal = ref(false);
const selectedTicket = ref(null);
const unreadNotifications = ref(3);

const upcomingEvents = ref([
  {
    id: 1,
    title: "Boxing Championship 2024",
    description: "การแข่งขันมวยชิงแชมป์",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "19:00",
    priceRange: "500-2,000 บาท",
  },
  {
    id: 2,
    title: "Muay Thai Festival",
    description: "เทศกาลมวยไทยประจำปี",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    time: "18:30",
    priceRange: "300-1,500 บาท",
  },
]);

const myTickets = ref([
  {
    id: 1,
    eventName: "Boxing Championship 2024",
    seatNumber: "A-15",
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "confirmed",
  },
  {
    id: 2,
    eventName: "Muay Thai Special",
    seatNumber: "B-23",
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "pending",
  },
]);

const userStats = ref({
  totalTickets: 12,
  totalSpent: "15.6K",
  favoriteZone: "VIP",
});

// Computed
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "สวัสดีตอนเช้า";
  if (hour < 18) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
});

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (status) => {
  const classes = {
    confirmed:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getStatusText = (status) => {
  const texts = {
    confirmed: "ยืนยันแล้ว",
    pending: "รอยืนยัน",
    cancelled: "ยกเลิก",
  };
  return texts[status] || status;
};

const navigateTo = (path) => {
  navigateTo(path);
};

const bookEvent = (event) => {
  navigateTo(`/booking?event=${event.id}`);
};

const showTicketQR = (ticket) => {
  selectedTicket.value = ticket;
  showTicketQRModal.value = true;
};

const handleQRResult = (result) => {
  console.log("QR Scan Result:", result);
  showQRScanner.value = false;

  // Handle different types of QR codes
  if (result.data.includes("ticket")) {
    // Handle ticket verification
  } else if (result.data.includes("promo")) {
    // Handle promotion
  }
};

// SEO
useSeoMeta({
  title: "Home - Patong Boxing Mobile",
  description: "Boxing ticket booking mobile application",
});
</script>

<style scoped>
.mobile-home-screen {
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  padding: 1rem;
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
  min-height: 100vh;
}

.dark .mobile-home-screen {
  background: linear-gradient(to bottom, #1e293b, #0f172a);
}

.header {
  padding-top: env(safe-area-inset-top);
}

.quick-actions .grid > button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.quick-actions .grid > button:active {
  transform: scale(0.95);
}

.upcoming-events,
.my-tickets,
.quick-stats {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
