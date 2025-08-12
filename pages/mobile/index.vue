<template>
  <div class="mobile-home min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="mobile-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">🥊 Patong Boxing</h1>
          <p class="text-blue-100">ยินดีต้อนรับ!</p>
        </div>

        <!-- Notification Bell -->
        <div class="relative">
          <button
            @click="toggleNotifications"
            class="p-2 rounded-full bg-white bg-opacity-20"
          >
            <Icon name="heroicons:bell" class="w-6 h-6 text-white" />
            <span
              v-if="unreadCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Announcements -->
    <section v-if="homeData?.announcements?.length" class="p-4">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon name="heroicons:megaphone" class="w-5 h-5 mr-2 text-blue-600" />
        📢 ประกาศ
      </h2>
      <div class="space-y-2">
        <div
          v-for="announcement in homeData.announcements"
          :key="announcement.id"
          :class="[
            'p-3 rounded-lg border-l-4 mobile-card',
            announcement.priority === 'high'
              ? 'bg-red-50 border-red-500'
              : 'bg-blue-50 border-blue-500',
          ]"
        >
          <h3 class="font-medium">{{ announcement.title }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ announcement.content }}</p>
          <p class="text-xs text-gray-400 mt-2">
            {{ formatDate(announcement.createdAt) }}
          </p>
        </div>
      </div>
    </section>

    <!-- Promotions -->
    <section v-if="homeData?.promotions?.length" class="p-4">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon name="heroicons:gift" class="w-5 h-5 mr-2 text-purple-600" />
        🎉 โปรโมชั่น
      </h2>
      <div class="overflow-x-auto">
        <div class="flex space-x-4 pb-2">
          <div
            v-for="promo in homeData.promotions"
            :key="promo.id"
            class="promotion-card min-w-64 flex-shrink-0"
            @click="openPromotion(promo)"
          >
            <div class="relative overflow-hidden">
              <img
                v-if="promo.imageUrl"
                :src="promo.imageUrl"
                :alt="promo.title"
                class="w-full h-32 object-cover"
              />
              <div
                class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
              >
                -{{ promo.discountPercent }}%
              </div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-lg text-white">{{ promo.title }}</h3>
              <p class="text-sm opacity-90 mb-2 text-white">
                {{ promo.description }}
              </p>
              <div class="text-xs opacity-75 text-white">
                หมดเขต: {{ formatDate(promo.validUntil) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="p-4">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon name="heroicons:chart-bar" class="w-5 h-5 mr-2 text-green-600" />
        📊 สถิติ
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="mobile-card">
          <div class="text-2xl font-bold text-blue-600">
            {{ homeData?.quickStats?.totalEvents || 0 }}
          </div>
          <div class="text-sm text-gray-600">กิจกรรมทั้งหมด</div>
        </div>
        <div class="mobile-card">
          <div class="text-2xl font-bold text-green-600">
            {{ homeData?.quickStats?.availableSeats?.toLocaleString() || 0 }}
          </div>
          <div class="text-sm text-gray-600">ที่นั่งว่าง</div>
        </div>
        <div class="mobile-card">
          <div class="text-2xl font-bold text-purple-600">
            ฿{{ homeData?.quickStats?.todaySales?.toLocaleString() || 0 }}
          </div>
          <div class="text-sm text-gray-600">ยอดขายวันนี้</div>
        </div>
        <div class="mobile-card">
          <div class="text-2xl font-bold text-orange-600">
            {{ homeData?.quickStats?.activeUsers || 0 }}
          </div>
          <div class="text-sm text-gray-600">ผู้ใช้งานออนไลน์</div>
        </div>
      </div>
    </section>

    <!-- Popular Zones -->
    <section v-if="homeData?.quickStats?.popularZones?.length" class="p-4">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon name="heroicons:fire" class="w-5 h-5 mr-2 text-red-600" />
        🔥 โซนยอดนิยม
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="zone in homeData.quickStats.popularZones"
          :key="zone"
          class="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm rounded-full font-medium"
        >
          {{ zone }}
        </span>
      </div>
    </section>

    <!-- Upcoming Events -->
    <section v-if="homeData?.upcomingEvents?.length" class="p-4">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon
          name="heroicons:calendar-days"
          class="w-5 h-5 mr-2 text-indigo-600"
        />
        🎪 กิจกรรมที่จะมาถึง
      </h2>
      <div class="space-y-3">
        <div
          v-for="event in homeData.upcomingEvents"
          :key="event.id"
          class="mobile-card cursor-pointer hover:shadow-md transition-shadow"
          @click="viewEvent(event)"
        >
          <div class="flex items-start space-x-3">
            <img
              v-if="event.imageUrl"
              :src="event.imageUrl"
              :alt="event.title"
              class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-lg truncate">{{ event.title }}</h3>
              <p class="text-gray-600 text-sm mb-1 flex items-center">
                <Icon name="heroicons:map-pin" class="w-4 h-4 mr-1" />
                {{ event.venue }}
              </p>
              <p class="text-gray-500 text-sm mb-2 flex items-center">
                <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                {{ formatDate(event.eventDate) }}
              </p>
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-green-600 font-bold">
                    เริ่มต้น ฿{{ event.ticketPrice.toLocaleString() }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm text-gray-500">ที่นั่งเหลือ</div>
                  <div class="font-bold text-blue-600">
                    {{ event.availableSeats }} ที่
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="p-4 pb-8">
      <h2 class="text-lg font-semibold mb-3 flex items-center">
        <Icon
          name="heroicons:lightning-bolt"
          class="w-5 h-5 mr-2 text-yellow-600"
        />
        ⚡ ดำเนินการด่วน
      </h2>
      <div class="grid grid-cols-2 gap-4">
        <button
          @click="$router.push('/book-tickets')"
          class="mobile-button bg-blue-600 hover:bg-blue-700"
        >
          <Icon name="heroicons:ticket" class="w-5 h-5 mr-2" />
          จองตั๋ว
        </button>
        <button
          @click="openQRScanner"
          class="mobile-button bg-green-600 hover:bg-green-700"
        >
          <Icon name="heroicons:qr-code" class="w-5 h-5 mr-2" />
          สแกน QR
        </button>
        <button
          @click="$router.push('/my-bookings')"
          class="mobile-button bg-purple-600 hover:bg-purple-700"
        >
          <Icon name="heroicons:clipboard-document-list" class="w-5 h-5 mr-2" />
          การจองของฉัน
        </button>
        <button
          @click="$router.push('/support')"
          class="mobile-button bg-orange-600 hover:bg-orange-700"
        >
          <Icon
            name="heroicons:chat-bubble-left-ellipsis"
            class="w-5 h-5 mr-2"
          />
          ช่วยเหลือ
        </button>
      </div>
    </section>

    <!-- Loading State -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 text-center">
        <Icon
          name="heroicons:arrow-path"
          class="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2"
        />
        <p class="text-gray-600">กำลังโหลด...</p>
      </div>
    </div>

    <!-- Notifications Panel -->
    <MobileNotificationPanel
      v-if="showNotifications"
      @close="toggleNotifications"
    />

    <!-- QR Scanner Modal -->
    <MobileQRScanner
      v-if="showQRScanner"
      @close="closeQRScanner"
      @scanned="handleQRScanned"
    />

    <!-- Promotion Detail Modal -->
    <MobilePromotionModal
      v-if="selectedPromotion"
      :promotion="selectedPromotion"
      @close="closePromotion"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { navigateTo } from "nuxt/app";
import { useMobile } from "@/composables/useMobile";
import { useNotifications } from "@/composables/useNotifications";
import { useSingleToast } from "@/composables/useSingleToast";

// Meta
definePageMeta({
  layout: "mobile",
});

// Composables
const mobile = useMobile();
const notifications = useNotifications();
const { showToast } = useSingleToast();

// State
const homeData = ref(null);
const loading = ref(false);
const showNotifications = ref(false);
const showQRScanner = ref(false);
const selectedPromotion = ref(null);

// Notifications
const unreadCount = computed(() => notifications.unreadCount.value);

/**
 * Load home screen data
 */
const loadHomeData = async () => {
  loading.value = true;
  try {
    homeData.value = await mobile.getHomeScreenData();
    // Also load notification count
    await notifications.getUnreadCount();
  } catch (error) {
    showToast("error", "ไม่สามารถโหลดข้อมูลหน้าหลักได้");
  } finally {
    loading.value = false;
  }
};

/**
 * Event handlers
 */
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const openQRScanner = () => {
  showQRScanner.value = true;
};

const closeQRScanner = () => {
  showQRScanner.value = false;
};

const handleQRScanned = async (qrData: string) => {
  try {
    const result = await mobile.scanQRCode(qrData);
    if (result.valid) {
      showToast("success", result.message);
      // Handle different QR types
      switch (result.type) {
        case "ticket":
          await navigateTo(`/tickets/${result.data.ticketId}`);
          break;
        case "seat":
          await navigateTo(`/book-tickets?seat=${result.data.seatId}`);
          break;
        case "promotion":
          // Show promotion details
          break;
      }
    } else {
      showToast("error", result.message);
    }
  } catch (error) {
    showToast("error", "ไม่สามารถประมวลผล QR Code ได้");
  } finally {
    closeQRScanner();
  }
};

const openPromotion = (promo: any) => {
  selectedPromotion.value = promo;
};

const closePromotion = () => {
  selectedPromotion.value = null;
};

const viewEvent = async (event: any) => {
  await navigateTo(`/events/${event.id}`);
};

/**
 * Utility functions
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Auto-refresh data
 */
let refreshInterval: NodeJS.Timeout;

onMounted(async () => {
  await loadHomeData();

  // Auto-refresh every 5 minutes
  refreshInterval = setInterval(() => {
    loadHomeData();
  }, 5 * 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.mobile-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  color: white;
}

.mobile-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1rem;
}

.mobile-button {
  width: 100%;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.promotion-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.promotion-card:hover {
  transform: translateY(-2px);
}
</style>
