<template>
  <BaseModal :isOpen="visible" @close="$emit('close')" size="lg">
    <template #header>
      <div class="flex items-center justify-center gap-3">
        <div
          class="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
        >
          <i class="mdi mdi-file-document-outline text-white text-2xl"></i>
        </div>
        <h2
          class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          {{ t("summary.title") }}
        </h2>
      </div>
    </template>

    <div class="max-h-[75vh] overflow-y-auto p-6 space-y-6">
      <!-- Booking Details Card -->
      <div
        class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg"
      >
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 bg-blue-500 rounded-lg">
            <i class="mdi mdi-ticket-outline text-white text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800">รายละเอียดการจอง</h3>
        </div>

        <div class="space-y-4">
          <div
            class="flex justify-between items-center p-3 bg-white/70 rounded-xl"
          >
            <div class="flex items-center gap-2">
              <i class="mdi mdi-map-marker text-blue-600"></i>
              <span class="font-semibold text-gray-700">{{
                t("summary.zone")
              }}</span>
            </div>
            <span
              class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold"
            >
              {{ pageData.zoneKey.toUpperCase() }}
            </span>
          </div>

          <div
            class="flex justify-between items-center p-3 bg-white/70 rounded-xl"
          >
            <div class="flex items-center gap-2">
              <i class="mdi mdi-seat text-green-600"></i>
              <span class="font-semibold text-gray-700">{{
                t("summary.seats")
              }}</span>
            </div>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="seat in pageData.selectedSeats"
                :key="seat.id"
                class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold"
              >
                {{ seat.seatNumber }}
              </span>
            </div>
          </div>

          <div
            class="flex justify-between items-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200"
          >
            <div class="flex items-center gap-2">
              <i class="mdi mdi-cash-multiple text-purple-600 text-xl"></i>
              <span class="font-bold text-gray-700">{{
                t("summary.total")
              }}</span>
            </div>
            <span class="text-2xl font-bold text-purple-600">
              {{ total.toLocaleString() }} {{ t("summary.baht") }}
            </span>
          </div>

          <!-- Countdown Timer -->
          <div v-if="countdown > 0" class="flex justify-center pt-2">
            <div
              class="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 inline-flex items-center gap-3 shadow-lg"
            >
              <div class="p-1 bg-white/20 rounded-full">
                <i class="mdi mdi-clock-outline text-white text-xl"></i>
              </div>
              <div>
                <p class="text-xs font-medium opacity-90">เวลาที่เหลือ</p>
                <p class="text-lg font-bold text-rose-700">
                  {{ Math.floor(countdown / 60) }}:{{
                    (countdown % 60).toString().padStart(2, "0")
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- System Health Status -->
          <div
            v-if="systemHealth && systemHealth.status !== 'healthy'"
            class="mt-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <i
                class="mdi mdi-alert-circle-outline text-orange-600 text-xl"
              ></i>
              <div>
                <p class="font-semibold text-orange-700">ระบบมีปัญหาเล็กน้อย</p>
                <p class="text-sm text-orange-600">กรุณาตรวจสอบการเชื่อมต่อ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Method Selection -->
      <div
        class="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg"
      >
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 bg-green-500 rounded-lg">
            <i class="mdi mdi-credit-card-outline text-white text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800">
            {{ t("summary.selectMethod") }}
          </h3>
        </div>

        <div class="space-y-3">
          <label
            class="flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 border-green-200 hover:border-green-400 bg-white/70 hover:bg-green-50 transition-all duration-300"
          >
            <input
              type="radio"
              v-model="pageData.method"
              value="CASH"
              class="accent-green-600 w-5 h-5"
            />
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="mdi mdi-wallet-outline text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-800">{{ t("summary.cash") }}</p>
              </div>
            </div>
          </label>
        </div>
        <div class="space-y-3 mt-2">
          <label
            class="flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 border-green-200 hover:border-green-400 bg-white/70 hover:bg-green-50 transition-all duration-300"
          >
            <input
              type="radio"
              v-model="pageData.method"
              value="VISA"
              class="accent-green-600 w-5 h-5"
            />
            <div class="flex items-center gap-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="mdi mdi-wallet-outline text-green-600 text-xl"></i>
              </div>
              <div>
                <p class="font-bold text-gray-800">{{ "VISA CARD" }}</p>
              </div>
            </div>
          </label>
        </div>
      </div>

      <!-- Customer Information Form -->
      <div
        v-if="['CASH', 'VISA'].includes(pageData.method)"
        class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 shadow-lg"
      >
        <div class="flex items-center gap-2 mb-6">
          <div class="p-2 bg-purple-500 rounded-lg">
            <i class="mdi mdi-account-outline text-white text-lg"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-800">ข้อมูลลูกค้า</h3>
        </div>

        <div class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              <i class="mdi mdi-account mr-1"></i>
              ชื่อลูกค้า <span class="text-red-500">*</span>
            </label>
            <input
              v-model="pageData.customerName"
              type="text"
              placeholder="กรอกชื่อลูกค้า"
              required
              :class="[
                'w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300',
                !pageData.customerName.trim() && pageData.customerName !== ''
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white',
              ]"
            />
            <p
              v-if="
                !pageData.customerName.trim() && pageData.customerName !== ''
              "
              class="text-sm text-red-500 mt-1 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle-outline"></i>
              กรุณากรอกชื่อลูกค้า
            </p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              <i class="mdi mdi-cash mr-1"></i>
              {{ t("summary.cashAmount") }}
            </label>
            <input
              v-model="pageData.total"
              type="number"
              min="0"
              placeholder="จำนวนเงิน"
              class="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 bg-white transition-all duration-300"
            />
          </div>

          <!-- <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              <i class="mdi mdi-email mr-1"></i>
              อีเมล <span class="text-red-500">(ใส่หรือไม่ใส่ก็ได้)</span>
            </label>
            <input
              v-model="pageData.customerEmail"
              type="email"
              placeholder="กรอกอีเมล"
              required
              :class="[
                'w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300',
                !isValidEmail && pageData.customerEmail !== ''
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white',
              ]"
            />
            <p
              v-if="!isValidEmail && pageData.customerEmail !== ''"
              class="text-sm text-red-500 mt-1 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle-outline"></i>
              กรุณากรอกอีเมลที่ถูกต้อง
            </p>
          </div> -->
          <!-- 
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">
              <i class="mdi mdi-phone mr-1"></i>
              เบอร์โทร <span class="text-red-500">(ใส่หรือไม่ใส่ก็ได้)</span>
            </label>
            <input
              v-model="pageData.customerPhone"
              type="tel"
              placeholder="กรอกเบอร์โทร"
              required
              :class="[
                'w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300',
                !isValidPhone && pageData.customerPhone !== ''
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white',
              ]"
            />
            <p
              v-if="!isValidPhone && pageData.customerPhone !== ''"
              class="text-sm text-red-500 mt-1 flex items-center gap-1"
            >
              <i class="mdi mdi-alert-circle-outline"></i>
              กรุณากรอกเบอร์โทร 10 หลัก
            </p>
          </div> -->
        </div>
      </div>

      <!-- Referrer Code -->
      <div
        class="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-2xl p-6 shadow-lg"
      >
        <div class="flex items-center gap-2 mb-4">
          <div class="p-2 bg-gray-500 rounded-lg">
            <i class="mdi mdi-account-group text-white text-lg"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800">รหัสผู้แนะนำ</h3>
          <span class="text-sm text-gray-500">(ถ้ามี)</span>
        </div>
        <input
          v-model="pageData.referrerCode"
          type="text"
          placeholder="กรอกรหัสผู้แนะนำ"
          class="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-gray-300 focus:border-gray-500 bg-white transition-all duration-300"
        />
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div class="flex justify-between gap-4 p-6">
        <button
          @click="onCancel"
          :disabled="isBookingInProgress"
          class="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 transition-all duration-300"
        >
          <i class="mdi mdi-close mr-2"></i>
          ยกเลิก
        </button>
        <button
          @click="submitOrders"
          :disabled="!isValid || isBookingInProgress"
          :class="[
            'flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300',
            !isValid || isBookingInProgress
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105',
          ]"
        >
          <span
            v-if="isBookingInProgress"
            class="flex items-center justify-center"
          >
            <i class="mdi mdi-loading mdi-spin mr-2"></i>
            กำลังดำเนินการ...
          </span>
          <span v-else class="flex items-center justify-center">
            <i class="mdi mdi-check-circle mr-2"></i>
            ยืนยันการชำระเงิน
          </span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
// ==================== IMPORTS ====================
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useAuthStore } from "../stores/auth";
import { usePageData } from "@/stores/pageData";
import { useOrder } from "@/composables/useOrder";
import { usePayments } from "@/composables/usePayments";
import { useTicketBookingManager } from "@/composables/useTicketBookingManager";

// ==================== STORES & COMPOSABLES ====================
const auth = useAuthStore();
const toast = useToast();
const { t } = useI18n();
const router = useRouter();
const pageData = usePageData();

// Enhanced Booking System
const {
  isBookingInProgress,
  systemHealth,
  createOrderWithProtection,
  cancelSeatSelection,
  checkSystemHealth,
} = useTicketBookingManager();

// API Composables
const { cancelOrder } = useOrder();
const { createSeatedPayment } = usePayments();

// ==================== PROPS & EMITS ====================
const props = defineProps({
  zone: String,
  selectedSeats: Array,
  visible: Boolean,
  total: Number,
  mode: { type: String, default: "booking" },
  userRole: { type: String, default: "GUEST" },
  dataZoneSelected: Object,
});

const emit = defineEmits(["close", "confirmed"]);

// ==================== REACTIVE STATE ====================
const slipFile = ref(null);
const slipPreview = ref(null);
const submitted = ref(false);
const countdown = ref(300); // 5 minutes
let countdownTimer = null;

// ==================== COMPUTED PROPERTIES ====================
const isValidEmail = computed(() => {
  if (!pageData.customerEmail) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pageData.customerEmail);
});

const isValidPhone = computed(() => {
  if (!pageData.customerPhone) return true;
  return /^\d{10}$/.test(pageData.customerPhone);
});

const isValid = computed(() => {
  if (["CASH", "VISA"].includes(pageData.method)) {
    return pageData.customerName?.trim()?.length > 0;
  }
  return true;
});

// ==================== UTILITY FUNCTIONS ====================
const setupCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownTimer);
      handleTimeout();
    }
  }, 1000);
};

const clearCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
};

const handleTimeout = () => {
  toast.warning(t("summary.timeout") || "หมดเวลาการจอง");
  emit("close");
};

const initializeData = () => {
  pageData.method = "CASH";
  pageData.zoneKey = props.zone;
  pageData.selectedSeats = props.selectedSeats;
  pageData.total = props.total;

  // Initialize customer fields if empty
  if (!pageData.customerName) pageData.customerName = "";
  if (!pageData.customerEmail) pageData.customerEmail = "";
  if (!pageData.customerPhone) pageData.customerPhone = "";
  if (!pageData.referrerCode) pageData.referrerCode = "";
};

// ==================== MAIN FUNCTIONS ====================
const onCancel = async () => {
  try {
    // Cancel seat selection and unlock seats
    await cancelSeatSelection();

    // Cancel order if exists
    if (props.dataZoneSelected?.orderId) {
      await cancelOrder(props.dataZoneSelected.orderId);
    }

    toast.success("ยกเลิกการจองเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error canceling booking:", error);
    toast.error(t("summary.cancelError") || "เกิดข้อผิดพลาดในการยกเลิก");
  } finally {
    emit("close");
  }
};

const submitOrders = async () => {
  // Validate required fields
  if (!pageData.customerName?.trim()) {
    toast.warning("กรุณากรอกชื่อลูกค้าก่อนดำเนินการ");
    return;
  }

  if (!isValid.value) {
    toast.warning("กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    return;
  }

  try {
    const paymentData = {
      orderId: props.dataZoneSelected?.orderId,
      amount: pageData.total,
      method: pageData.method.toUpperCase(),
      customerName: pageData.customerName.trim(),
      customerEmail: pageData.customerEmail.trim(),
      customerPhone: pageData.customerPhone.trim(),
      referrerCode: pageData.referrerCode?.trim() || undefined,
    };

    await createSeatedPayment(paymentData);

    // Handle success based on mode
    await handlePaymentSuccess();
  } catch (error) {
    console.error("Payment submission error:", error);
    handlePaymentError(error);
  }
};

const handlePaymentSuccess = async () => {
  const orderId = props.dataZoneSelected?.orderId;

  toast.success("ยืนยันการชำระเงินเรียบร้อยแล้ว");

  if (props.mode === "booking") {
    // Regular booking flow
    await router.push({
      path: "/confirmation",
      query: {
        orderId,
        zone: pageData.zoneKey,
        seats: pageData.selectedSeats.map((s) => s.seatNumber).join(","),
        total: pageData.total,
      },
    });
  } else {
    // Admin flow
    await router.push({
      path: "/admin/orders",
    });
  }

  pageData.resetPageData();
  emit("close");
};

const handlePaymentError = (error) => {
  const errorMessage = error.message?.toLowerCase() || "";

  if (errorMessage.includes("seat")) {
    toast.error("ที่นั่งถูกจองแล้ว กรุณาเลือกที่นั่งอื่น");
  } else if (errorMessage.includes("timeout")) {
    toast.error("หมดเวลาการจอง กรุณาเริ่มต้นใหม่");
  } else if (errorMessage.includes("network")) {
    toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
  } else {
    toast.error(t("summary.submitError") || "เกิดข้อผิดพลาดในการส่งข้อมูล");
  }
};

// ==================== LIFECYCLE HOOKS ====================
onMounted(async () => {
  try {
    setupCountdown();
    initializeData();
    await checkSystemHealth();
  } catch (error) {
    console.error("Error initializing SummaryModal:", error);
    toast.error("เกิดข้อผิดพลาดในการเริ่มต้นระบบ");
  }
});

onBeforeUnmount(() => {
  clearCountdown();
});
</script>

<style scoped>
/* Removed custom CSS in favor of TailwindCSS */
</style>
