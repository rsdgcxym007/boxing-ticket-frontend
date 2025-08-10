<template>
  <BaseModal
    class="h-full w-full max-w-[95vw] sm:max-w-[480px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px] 2xl:max-w-[1200px]"
    :isOpen="visible"
    @close="onCancel"
    size="lg"
  >
    <template #header>
      <div
        class="flex items-center gap-3 p-6 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200"
      >
        <div
          class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <i class="mdi mdi-receipt text-white text-xl"></i>
        </div>
        <div>
          <h2 class="text-xl font-bold text-slate-800">
            {{ t("summary.title") }}
          </h2>
          <p class="text-sm text-slate-600">
            กรุณาตรวจสอบข้อมูลและดำเนินการชำระเงิน
          </p>
        </div>
      </div>
    </template>

    <div class="max-h-[75vh] overflow-y-auto">
      <!-- Order Summary Section -->
      <div class="p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div class="max-w-2xl mx-auto">
          <!-- Order Info Card -->
          <div
            class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-6"
          >
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
              <div class="flex items-center justify-between text-white">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center"
                  >
                    <i class="mdi mdi-ticket text-emerald-600"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base">รายละเอียดการจอง</h3>
                    <p class="text-xs opacity-90">Order Details</p>
                  </div>
                </div>
                <!-- Countdown Timer -->
                <div
                  v-if="countdown > 0"
                  class="bg-white/20 rounded-lg px-3 py-1.5"
                >
                  <div class="flex items-center gap-2">
                    <i class="mdi mdi-clock-outline text-sm"></i>
                    <span class="text-sm font-mono font-bold">
                      {{ Math.floor(countdown / 60) }}:{{
                        (countdown % 60).toString().padStart(2, "0")
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <!-- Zone & Seats -->
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-slate-50 rounded-xl">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2"
                  >
                    <i class="mdi mdi-map-marker text-blue-600"></i>
                  </div>
                  <p class="text-xs text-slate-600 mb-1">โซน</p>
                  <p class="font-bold text-slate-800">
                    {{ pageData.zoneKey.toUpperCase() }}
                  </p>
                </div>

                <div class="text-center p-4 bg-slate-50 rounded-xl">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2"
                  >
                    <i class="mdi mdi-seat text-green-600"></i>
                  </div>
                  <p class="text-xs text-slate-600 mb-1">ที่นั่ง</p>
                  <div class="flex flex-wrap gap-1 justify-center">
                    <span
                      v-for="seat in pageData.selectedSeats"
                      :key="seat.id"
                      class="px-2 py-1 bg-green-500 text-white rounded-md text-xs font-medium"
                    >
                      {{ seat.seatNumber }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Total Price -->
              <div
                class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center"
              >
                <p class="text-sm opacity-90 mb-1">ราคารวม</p>
                <p class="text-2xl font-bold">
                  {{ pageData.total.toLocaleString() }} บาท
                </p>
              </div>
            </div>
          </div>

          <!-- Payment & Customer Info -->
          <div
            class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
          >
            <div class="p-6 space-y-6">
              <!-- Payment Method -->
              <div>
                <h4
                  class="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4"
                >
                  <div
                    class="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="mdi mdi-credit-card text-emerald-600 text-sm"></i>
                  </div>
                  เลือกวิธีชำระเงิน
                </h4>

                <div class="grid grid-cols-2 gap-3">
                  <label class="relative">
                    <input
                      type="radio"
                      name="payment-method"
                      v-model="pageData.method"
                      value="CASH"
                      class="peer sr-only"
                    />
                    <div
                      class="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:border-emerald-300"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                        >
                          <i class="mdi mdi-cash text-emerald-600"></i>
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800">เงินสด</p>
                          <p class="text-xs text-slate-600">Cash Payment</p>
                        </div>
                      </div>
                    </div>
                  </label>

                  <label class="relative">
                    <input
                      type="radio"
                      name="payment-method"
                      v-model="pageData.method"
                      value="CREDIT_CARD"
                      class="peer sr-only"
                    />
                    <div
                      class="p-4 border-2 border-slate-200 rounded-xl cursor-pointer transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:border-emerald-300"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                        >
                          <i class="mdi mdi-credit-card text-blue-600"></i>
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800">บัตรเครดิต</p>
                          <p class="text-xs text-slate-600">Credit Card</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <!-- Cash Amount -->
              <div v-if="['CASH', 'CREDIT_CARD'].includes(pageData.method)">
                <label
                  class="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                >
                  <i class="mdi mdi-cash text-amber-600"></i>
                  จำนวนเงินสด (บาท)
                </label>
                <input
                  v-model="pageData.total"
                  type="number"
                  min="0"
                  placeholder="กรอกจำนวนเงิน"
                  class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
              </div>

              <!-- Customer Information - Only show if not ONSITE -->
              <div v-if="props.purchaseType !== OrderPurchaseType.ONSITE">
                <h4
                  class="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4"
                >
                  <div
                    class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="mdi mdi-account text-purple-600 text-sm"></i>
                  </div>
                  ข้อมูลลูกค้า / ข้อมูลโรงแรม
                </h4>

                <div class="space-y-4">
                  <!-- Customer Basic Info -->
                  <div>
                    <label
                      class="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      ชื่อลูกค้า <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="pageData.customerName"
                      type="text"
                      placeholder="กรอกชื่อลูกค้า"
                      required
                      :class="[
                        'w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors',
                        !pageData.customerName.trim() &&
                        pageData.customerName !== ''
                          ? 'border-red-300 bg-red-50'
                          : 'border-slate-300',
                      ]"
                    />
                    <p
                      v-if="
                        !pageData.customerName.trim() &&
                        pageData.customerName !== ''
                      "
                      class="text-xs text-red-500 mt-1 flex items-center gap-1"
                    >
                      <i class="mdi mdi-alert-circle-outline"></i>
                      กรุณากรอกชื่อลูกค้า
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        class="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        เบอร์โทร <span class="text-slate-500">(ไม่บังคับ)</span>
                      </label>
                      <input
                        v-model="pageData.customerPhone"
                        type="tel"
                        placeholder="กรอกเบอร์โทร"
                        :class="[
                          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors',
                          !isValidPhone && pageData.customerPhone !== ''
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300',
                        ]"
                      />
                      <p
                        v-if="!isValidPhone && pageData.customerPhone !== ''"
                        class="text-xs text-red-500 mt-1 flex items-center gap-1"
                      >
                        <i class="mdi mdi-alert-circle-outline"></i>
                        กรุณากรอกเบอร์โทร 10 หลัก
                      </p>
                    </div>

                    <div>
                      <label
                        class="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        อีเมล <span class="text-slate-500">(ไม่บังคับ)</span>
                      </label>
                      <input
                        v-model="pageData.customerEmail"
                        type="email"
                        placeholder="กรอกอีเมล"
                        :class="[
                          'w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors',
                          !isValidEmail && pageData.customerEmail !== ''
                            ? 'border-red-300 bg-red-50'
                            : 'border-slate-300',
                        ]"
                      />
                      <p
                        v-if="!isValidEmail && pageData.customerEmail !== ''"
                        class="text-xs text-red-500 mt-1 flex items-center gap-1"
                      >
                        <i class="mdi mdi-alert-circle-outline"></i>
                        กรุณากรอกอีเมลที่ถูกต้อง
                      </p>
                    </div>
                  </div>

                  <!-- Hotel Information -->
                  <div class="border-t pt-4">
                    <h5
                      class="flex items-center gap-2 text-base font-semibold text-slate-700 mb-3"
                    >
                      <i class="mdi mdi-domain text-amber-600"></i>
                      ข้อมูลโรงแรม
                    </h5>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          ชื่อโรงแรม
                        </label>
                        <input
                          v-model="pageData.hotelName"
                          type="text"
                          placeholder="เช่น โรงแรมแกรนด์พาเลซ"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          เขต/พื้นที่
                        </label>
                        <input
                          v-model="pageData.hotelDistrict"
                          type="text"
                          placeholder="เช่น สีลม, สุขุมวิท"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          หมายเลขห้อง
                        </label>
                        <input
                          v-model="pageData.roomNumber"
                          type="text"
                          placeholder="เช่น 1205"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          เลขที่ Voucher (V/C)
                        </label>
                        <input
                          v-model="pageData.voucherNumber"
                          type="text"
                          placeholder="เช่น VC12345"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          ผู้ใหญ่ (AD)
                        </label>
                        <input
                          v-model.number="pageData.adultCount"
                          type="number"
                          min="1"
                          placeholder="1"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          เด็ก (CH)
                        </label>
                        <input
                          v-model.number="pageData.childCount"
                          type="number"
                          min="0"
                          placeholder="0"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          ทารก (IF)
                        </label>
                        <input
                          v-model.number="pageData.infantCount"
                          type="number"
                          min="0"
                          placeholder="0"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          ชื่อผู้จอง
                        </label>
                        <input
                          v-model="pageData.bookerName"
                          type="text"
                          placeholder="เช่น คุณสมชาย ใจดี"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          class="block text-sm font-semibold text-slate-700 mb-2"
                        >
                          เวลาที่คนไปรับ
                        </label>
                        <input
                          v-model="pageData.pickupScheduledTime"
                          type="time"
                          class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label
                        class="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          v-model="pageData.includesPickup"
                          class="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                        />
                        <div class="flex items-center gap-2">
                          <i class="mdi mdi-car-pickup text-purple-600"></i>
                          <span class="text-sm font-semibold text-slate-700"
                            >รวมการรับ</span
                          >
                        </div>
                      </label>

                      <label
                        class="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          v-model="pageData.includesDropoff"
                          class="w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 rounded"
                        />
                        <div class="flex items-center gap-2">
                          <i class="mdi mdi-car-off text-purple-600"></i>
                          <span class="text-sm font-semibold text-slate-700"
                            >รวมการส่ง</span
                          >
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Referrer Code -->
              <div>
                <label
                  class="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2"
                >
                  <i class="mdi mdi-account-group text-slate-600"></i>
                  รหัสผู้แนะนำ <span class="text-slate-500">(ถ้ามี)</span>
                </label>
                <BaseSelect
                  v-model="pageData.referrerCode"
                  :options="masterData || []"
                  placeholder="กรอกรหัสผู้แนะนำ เช่น FRESHYTOUR"
                  clearable
                  searchable
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <template #footer>
      <div
        class="flex justify-between gap-3 p-6 bg-slate-50 border-t border-slate-200"
      >
        <button
          @click="onCancel"
          :disabled="isBookingInProgress"
          class="flex-1 px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <i class="mdi mdi-close text-base"></i>
          ยกเลิก
        </button>
        <button
          @click="submitOrders"
          :disabled="!isValid || isBookingInProgress"
          :class="[
            'flex-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2',
            !isValid || isBookingInProgress
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02]',
          ]"
        >
          <span v-if="isBookingInProgress" class="flex items-center gap-2">
            <i class="mdi mdi-loading mdi-spin text-base"></i>
            กำลังดำเนินการ...
          </span>
          <span v-else class="flex items-center gap-2">
            <i class="mdi mdi-check-circle text-base"></i>
            ยืนยันการชำระเงิน
          </span>
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useSingleToast } from "@/composables/useSingleToast";
import { usePageData } from "@/stores/pageData";
import { useOrder } from "@/composables/useOrder";
import { usePayments } from "@/composables/usePayments";
import { useTicketBookingManager } from "@/composables/useTicketBookingManager";
import { useReferrerMasterData } from "../composables/useReferrerMasterData";
import { OrderPurchaseType } from "@/types/Enums";
import BaseSelect from "../components/base/BaseSelect.vue";

// ==================== STORES & COMPOSABLES ====================
const { masterData, fetchMasterData } = useReferrerMasterData();
const { showToast } = useSingleToast();
const { t } = useI18n();
const router = useRouter();
const pageData = usePageData();

// Enhanced Booking System
const { isBookingInProgress, cancelSeatSelection, checkSystemHealth } =
  useTicketBookingManager();

// API Composables
const { cancelOrder } = useOrder();
const { createSeatedPayment, createStandingPayment } = usePayments();

// ==================== PROPS & EMITS ====================
const props = defineProps({
  visible: Boolean,
  purchaseType: String,
  selectedSeats: Array,
  zone: String,
  total: Number,
  userRole: { type: String, default: "GUEST" },
  dataZoneSelected: Object,
  mode: { type: String, default: "booking" },
});

const emit = defineEmits(["close", "confirmed"]);

// ==================== REACTIVE/COMPUTED ====================
const slipFile = ref(null);
const slipPreview = ref(null);
const submitted = ref(false);
const countdown = ref(300); // 5 นาที (300 วินาที)
let countdownTimer = null;

// ระบุว่าเป็น Standing หรือไม่ จาก props.zone
const isStanding = computed(
  () => (props.zone || "").toString().toLowerCase() === "standing"
);

const isValidEmail = computed(() => {
  if (!pageData.customerEmail) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pageData.customerEmail);
});

const isValidPhone = computed(() => {
  if (!pageData.customerPhone) return true;
  return /^\d{10}$/.test(pageData.customerPhone);
});

const isValid = computed(() => {
  if (props.purchaseType === OrderPurchaseType.ONSITE) return true;
  return true;
});

// Computed property for total display
const total = computed(() => {
  return pageData.total || props.total || 0;
});

// ==================== UTILITY FUNCTIONS ====================
const setupCountdown = () => {
  if (countdownTimer) clearInterval(countdownTimer);
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
  showToast("warning", t("summary.timeout") || "หมดเวลาการจอง");
  emit("close");
};

// Add a flag to prevent recursive initialization
const isInitializing = ref(false);

const initializeData = () => {
  // Prevent recursive calls
  if (isInitializing.value) return;
  isInitializing.value = true;

  try {
    // ให้ค่าที่ผู้ใช้เลือก (pageData.method) สำคัญที่สุด รองลงมาคือค่าจาก dataZoneSelected และสุดท้าย default เป็น "CASH"
    const newMethod =
      pageData.method || props.dataZoneSelected?.method || "CASH";
    const newZoneKey = props.zone || "";
    const newSelectedSeats = isStanding.value ? [] : props.selectedSeats || [];
    const newTotal = props.total || props.dataZoneSelected?.total || 0;
    const newCustomerName = props.dataZoneSelected?.customerName || "";
    const newCustomerPhone = props.dataZoneSelected?.customerPhone || "";
    const newCustomerEmail = props.dataZoneSelected?.customerEmail || "";
    const newReferrerCode = props.dataZoneSelected?.referrerCode || undefined;
    const newPurchaseType =
      props.dataZoneSelected?.purchaseType || props.purchaseType || "ONLINE";

    // Only update if values have actually changed
    if (pageData.method !== newMethod) pageData.method = newMethod;
    if (pageData.zoneKey !== newZoneKey) pageData.zoneKey = newZoneKey;
    if (
      JSON.stringify(pageData.selectedSeats) !==
      JSON.stringify(newSelectedSeats)
    ) {
      pageData.selectedSeats = newSelectedSeats;
    }
    if (pageData.total !== newTotal) pageData.total = newTotal;
    if (pageData.customerName !== newCustomerName)
      pageData.customerName = newCustomerName;
    if (pageData.customerPhone !== newCustomerPhone)
      pageData.customerPhone = newCustomerPhone;
    if (pageData.customerEmail !== newCustomerEmail)
      pageData.customerEmail = newCustomerEmail;
    if (pageData.referrerCode !== newReferrerCode)
      pageData.referrerCode = newReferrerCode;
    if (pageData.purchaseType !== newPurchaseType)
      pageData.purchaseType = newPurchaseType;

    // Initialize hotel data
    const newHotelName = props.dataZoneSelected?.hotelName || null;
    const newHotelDistrict = props.dataZoneSelected?.hotelDistrict || null;
    const newRoomNumber = props.dataZoneSelected?.roomNumber || null;
    const newAdultCount = props.dataZoneSelected?.adultCount || 1;
    const newChildCount = props.dataZoneSelected?.childCount || 0;
    const newInfantCount = props.dataZoneSelected?.infantCount || 0;
    const newVoucherNumber = props.dataZoneSelected?.voucherNumber || null;
    const newPickupScheduledTime =
      props.dataZoneSelected?.pickupScheduledTime || null;
    const newBookerName = props.dataZoneSelected?.bookerName || null;
    const newIncludesPickup = props.dataZoneSelected?.includesPickup || false;
    const newIncludesDropoff = props.dataZoneSelected?.includesDropoff || false;

    if (pageData.hotelName !== newHotelName) pageData.hotelName = newHotelName;
    if (pageData.hotelDistrict !== newHotelDistrict)
      pageData.hotelDistrict = newHotelDistrict;
    if (pageData.roomNumber !== newRoomNumber)
      pageData.roomNumber = newRoomNumber;
    if (pageData.adultCount !== newAdultCount)
      pageData.adultCount = newAdultCount;
    if (pageData.childCount !== newChildCount)
      pageData.childCount = newChildCount;
    if (pageData.infantCount !== newInfantCount)
      pageData.infantCount = newInfantCount;
    if (pageData.voucherNumber !== newVoucherNumber)
      pageData.voucherNumber = newVoucherNumber;
    if (pageData.pickupScheduledTime !== newPickupScheduledTime)
      pageData.pickupScheduledTime = newPickupScheduledTime;
    if (pageData.bookerName !== newBookerName)
      pageData.bookerName = newBookerName;
    if (pageData.includesPickup !== newIncludesPickup)
      pageData.includesPickup = newIncludesPickup;
    if (pageData.includesDropoff !== newIncludesDropoff)
      pageData.includesDropoff = newIncludesDropoff;
  } finally {
    // Reset the flag after a small delay to allow reactive updates to settle
    nextTick(() => {
      isInitializing.value = false;
    });
  }
};

// รีอินิตเมื่อเปิด modal หรือเมื่อข้อมูลออเดอร์เข้ามาใหม่
watch(
  () => props.visible,
  (newVisible, oldVisible) => {
    if (newVisible && !oldVisible && !isInitializing.value) {
      initializeData();
    }
  }
);

watch(
  () => props.dataZoneSelected,
  (newData, oldData) => {
    if (props.visible && !isInitializing.value && newData !== oldData) {
      initializeData();
    }
  },
  { deep: true }
);

// ==================== MAIN FUNCTIONS ====================
const onCancel = async () => {
  try {
    await cancelSeatSelection();
    if (props.dataZoneSelected?.orderId) {
      await cancelOrder(props.dataZoneSelected.orderId);
    }
    showToast("success", "ยกเลิกการจองเรียบร้อยแล้ว");
  } catch (error) {
    console.error("Error canceling booking:", error);
    showToast("error", t("summary.cancelError") || "เกิดข้อผิดพลาดในการยกเลิก");
  } finally {
    emit("close");
  }
};

const submitOrders = async () => {
  if (
    props.purchaseType !== OrderPurchaseType.ONSITE &&
    !pageData.customerName?.trim()
  ) {
    showToast("warning", "กรุณากรอกชื่อลูกค้าก่อนดำเนินการ");
    return;
  }

  if (!isValid.value) {
    showToast("warning", "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง");
    return;
  }

  try {
    const paymentData = {
      orderId: props.dataZoneSelected?.orderId || props.dataZoneSelected?.id,
      amount: normalizeCurrency(pageData.total),
      method: pageData.method.toUpperCase(),
      customerName: pageData.customerName?.trim() || "ลูกค้าทั่วไป",
      customerEmail: pageData.customerEmail?.trim() || null,
      customerPhone: pageData.customerPhone?.trim() || null,
      referrerCode: pageData.referrerCode?.trim() || undefined,
      purchaseType: pageData.purchaseType.toUpperCase(),
      // แนบ ticketType สำหรับ Standing เพื่อความชัดเจน (ถ้าจำเป็นที่ backend)
      ...(isStanding.value ? { ticketType: "STANDING" } : {}),
    };

    // ส่งฟิลด์โรงแรมเฉพาะเมื่อเป็น BOOKING เท่านั้น
    if (pageData.purchaseType === OrderPurchaseType.BOOKING) {
      Object.assign(paymentData, {
        hotelName: pageData.hotelName?.trim() || null,
        hotelDistrict: pageData.hotelDistrict?.trim() || null,
        roomNumber: pageData.roomNumber?.trim() || null,
        adultCount: pageData.adultCount || 1,
        childCount: pageData.childCount || 0,
        infantCount: pageData.infantCount || 0,
        voucherNumber: pageData.voucherNumber?.trim() || null,
        pickupScheduledTime: pageData.pickupScheduledTime || null,
        bookerName: pageData.bookerName?.trim() || null,
        includesPickup: pageData.includesPickup || false,
        includesDropoff: pageData.includesDropoff || false,
      });
    }

    // เลือก API ตาม zone (Standing/Seated)
    if (isStanding.value) {
      await createStandingPayment(paymentData);
    } else {
      await createSeatedPayment(paymentData);
    }

    await handlePaymentSuccess();
  } catch (error) {
    handlePaymentError(error);
  }
};

const normalizeCurrency = (input) => {
  if (typeof input === "number") return input;
  if (!input) return 0;
  return parseFloat(String(input).replace(/,/g, ""));
};

const handlePaymentSuccess = async () => {
  const orderId = props.dataZoneSelected?.orderId || props.dataZoneSelected?.id;
  showToast("success", "ยืนยันการชำระเงินเรียบร้อยแล้ว");

  await router.push({
    path: "/confirmation",
    query: {
      orderId,
      zone: pageData.zoneKey,
      ...(Array.isArray(pageData.selectedSeats) && pageData.selectedSeats.length
        ? { seats: pageData.selectedSeats.map((s) => s.seatNumber).join(",") }
        : {}),
      total: pageData.total,
    },
  });

  pageData.resetPageData();
  emit("close");
};

const handlePaymentError = (error) => {
  const errorMessage = error.message?.toLowerCase() || "";
  if (errorMessage.includes("seat")) {
    showToast("error", "ที่นั่งถูกจองแล้ว กรุณาเลือกที่นั่งอื่น");
  } else if (errorMessage.includes("timeout")) {
    showToast("error", "หมดเวลาการจอง กรุณาเริ่มต้นใหม่");
  } else if (errorMessage.includes("network")) {
    showToast("error", "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
  } else {
    showToast("error", error.message);
  }
};

// ==================== LIFECYCLE HOOKS ====================
onMounted(async () => {
  try {
    fetchMasterData();
    setupCountdown();
    initializeData();
    await checkSystemHealth();
  } catch (error) {
    console.error("Error initializing SummaryModal:", error);
    showToast("error", "เกิดข้อผิดพลาดในการเริ่มต้นระบบ");
  }
});

onBeforeUnmount(() => {
  clearCountdown();
});
</script>

<style scoped>
.flex-2 {
  flex: 2;
}
</style>
