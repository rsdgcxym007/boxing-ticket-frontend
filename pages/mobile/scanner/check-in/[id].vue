<template>
  <div class="check-in-page">
    <!-- Header -->
    <div class="check-in-header">
      <div class="header-content">
        <button @click="$router.back()" class="back-button">
          <Icon icon="mdi:arrow-left" class="text-xl" />
        </button>
        <h1 class="header-title">เช็คอิน</h1>
        <div class="header-spacer"></div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="check-in-content">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">กำลังตรวจสอบข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <Icon icon="mdi:alert-circle" class="error-icon" />
        <h2 class="error-title">เกิดข้อผิดพลาด</h2>
        <p class="error-message">{{ error }}</p>
        <button @click="retryCheckIn" class="retry-button">
          <Icon icon="mdi:refresh" class="mr-2" />
          ลองอีกครั้ง
        </button>
      </div>

      <!-- Success State -->
      <div v-else-if="checkInResult" class="success-container">
        <Icon icon="mdi:check-circle" class="success-icon" />
        <h2 class="success-title">เช็คอินสำเร็จ!</h2>

        <div class="ticket-info">
          <div class="info-row">
            <span class="info-label">Order ID:</span>
            <span class="info-value">{{ checkInResult.orderId }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ชื่อลูกค้า:</span>
            <span class="info-value">{{ checkInResult.customerName }}</span>
          </div>
          <div v-if="checkInResult.customerPhone" class="info-row">
            <span class="info-label">โทรศัพท์:</span>
            <span class="info-value">{{ checkInResult.customerPhone }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">ประเภทตั้ว:</span>
            <span class="info-value">{{
              getTicketTypeText(checkInResult.ticketType)
            }}</span>
          </div>
          <div
            v-if="checkInResult.seats && checkInResult.seats.length"
            class="info-row"
          >
            <span class="info-label">ที่นั่ง:</span>
            <span class="info-value">{{ checkInResult.seats.join(", ") }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">เวลาเช็คอิน:</span>
            <span class="info-value">{{
              formatDateTime(checkInResult.checkInTime)
            }}</span>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="scanNext" class="scan-next-button">
            <Icon icon="mdi:qrcode-scan" class="mr-2" />
            สแกนต่อ
          </button>
          <button @click="goToScanner" class="back-scanner-button">
            <Icon icon="mdi:camera" class="mr-2" />
            กลับสู่หน้าสแกน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useQRScannerStore } from "@/stores/qrScanner";

// Composables
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const qrStore = useQRScannerStore();

// State
const isLoading = ref(true);
const error = ref("");
const checkInResult = ref(null);

// Check authentication
if (!authStore.isAuthenticated) {
  await navigateTo("/mobile/login");
}

// Methods
const performCheckIn = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    const orderId = route.params.id;
    const qrCode = route.query.qr;

    if (!orderId || !qrCode) {
      throw new Error("ข้อมูลไม่ครบถ้วน กรุณาสแกน QR Code ใหม่");
    }

    console.log("🎫 Performing check-in for order:", orderId);

    // Perform check-in via scanner store
    const result = await qrStore.scanQRCode(qrCode);

    if (result.success) {
      checkInResult.value = result.data;
      console.log("✅ Check-in successful:", result);
    } else {
      throw new Error(result.message || "เช็คอินไม่สำเร็จ");
    }
  } catch (err) {
    console.error("❌ Check-in failed:", err);
    error.value = err.message || "เกิดข้อผิดพลาดในการเช็คอิน";
  } finally {
    isLoading.value = false;
  }
};

const retryCheckIn = () => {
  performCheckIn();
};

const scanNext = () => {
  router.push("/mobile/scanner");
};

const goToScanner = () => {
  router.push("/mobile/scanner");
};

const getTicketTypeText = (type) => {
  return type === "seated" ? "ที่นั่ง" : "ยืน";
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "-";

  const date = new Date(dateTimeString);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Lifecycle
onMounted(() => {
  performCheckIn();
});

// SEO
definePageMeta({
  layout: "mobile",
});

useSeoMeta({
  title: "เช็คอิน - Patong Boxing",
  description: "หน้าเช็คอินตั๋วเข้าชมการแข่งขันมวย",
});
</script>

<style scoped>
.check-in-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* Header */
.check-in-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding-top: env(safe-area-inset-top);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.back-button:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.95);
}

.header-title {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.header-spacer {
  width: 44px;
}

/* Content */
.check-in-content {
  flex: 1;
  padding: calc(4rem + env(safe-area-inset-top)) 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Loading State */
.loading-container {
  text-align: center;
  color: white;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-text {
  font-size: 1.1rem;
  margin: 0;
}

/* Error State */
.error-container {
  text-align: center;
  color: white;
  max-width: 300px;
}

.error-icon {
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.error-message {
  font-size: 1rem;
  margin: 0 0 2rem;
  opacity: 0.9;
  line-height: 1.5;
}

.retry-button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
}

.retry-button:active {
  background: #dc2626;
  transform: scale(0.98);
}

/* Success State */
.success-container {
  text-align: center;
  color: white;
  max-width: 400px;
  width: 100%;
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1rem;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2rem;
}

/* Ticket Info */
.ticket-info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  opacity: 0.8;
}

.info-value {
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scan-next-button,
.back-scanner-button {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.scan-next-button {
  background: #10b981;
  color: white;
}

.scan-next-button:active {
  background: #059669;
  transform: scale(0.98);
}

.back-scanner-button {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.back-scanner-button:active {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.98);
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .ticket-info {
    padding: 1rem;
  }

  .info-value {
    max-width: 50%;
  }
}
</style>
