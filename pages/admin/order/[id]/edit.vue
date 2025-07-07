<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white"
  >
    <div
      class="p-4 md:p-6 lg:p-8 w-full mx-auto space-y-6 lg:space-y-8 max-w-7xl"
    >
      <!-- Header -->
      <div
        class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6"
      >
        <div class="flex items-center gap-4">
          <button
            @click="$router.go(-1)"
            class="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-sm md:text-base"
          >
            <i class="mdi mdi-arrow-left text-lg"></i>
            กลับ
          </button>
          <div>
            <h1
              class="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1"
            >
              แก้ไขที่นั่ง
            </h1>
            <p class="text-sm md:text-base text-blue-300">
              จัดการและแก้ไขข้อมูลการจองที่นั่ง
            </p>
          </div>
        </div>
        <div
          class="bg-[#1a2b4d] px-4 md:px-6 py-3 md:py-4 rounded-lg border border-blue-600 shadow-lg"
        >
          <div class="text-xs md:text-sm text-gray-400 mb-1">Order ID</div>
          <div
            class="text-sm md:text-base lg:text-lg font-mono text-blue-300 font-semibold"
          >
            {{ orderId }}
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <BaseLoading />
      </div>

      <!-- Order Details -->
      <div v-else-if="orderData" class="space-y-6">
        <!-- Order Information -->
        <BaseCard
          class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] border-blue-600 shadow-2xl"
        >
          <template #header>
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <h2
                class="text-xl md:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2"
              >
                <i class="mdi mdi-ticket-confirmation text-blue-400"></i>
                ข้อมูลออเดอร์
              </h2>
              <div class="flex items-center gap-2">
                <span class="text-xs md:text-sm text-gray-400">Order:</span>
                <span class="text-sm md:text-base font-mono text-blue-300">{{
                  orderData.orderNumber
                }}</span>
              </div>
            </div>
          </template>

          <div
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
          >
            <!-- Status and Basic Info -->
            <div class="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <label
                  class="block text-sm md:text-base lg:text-lg font-medium text-blue-300 mb-3"
                >
                  <i class="mdi mdi-flag-variant mr-2"></i>สถานะ
                </label>
                <div class="flex flex-wrap gap-2">
                  <span
                    :class="getStatusClass(orderData.status)"
                    class="px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-lg text-white"
                  >
                    {{ getStatusLabel(orderData.status) }}
                  </span>
                  <span
                    :class="getPaymentStatusClass(orderData.paymentStatus)"
                    class="px-4 py-2 rounded-full text-sm md:text-base font-bold shadow-lg text-white"
                  >
                    {{ getPaymentStatusLabel(orderData.paymentStatus) }}
                  </span>
                </div>
              </div>

              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <label
                  class="block text-sm md:text-base lg:text-lg font-medium text-blue-300 mb-3"
                >
                  <i class="mdi mdi-ticket mr-2"></i>ประเภทตั๋ว
                </label>
                <p
                  class="text-white text-base md:text-lg lg:text-xl font-semibold"
                >
                  {{ orderData.ticketType }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                  <label
                    class="block text-sm md:text-base font-medium text-blue-300 mb-2"
                  >
                    <i class="mdi mdi-numeric mr-2"></i>จำนวน
                  </label>
                  <p class="text-white text-lg md:text-xl font-bold">
                    {{ orderData.quantity }}
                  </p>
                </div>
                <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                  <label
                    class="block text-sm md:text-base font-medium text-blue-300 mb-2"
                  >
                    <i class="mdi mdi-cash mr-2"></i>ราคาต่อใบ
                  </label>
                  <p class="text-white text-lg md:text-xl font-bold">
                    {{ formatCurrency(orderData.price) }}
                  </p>
                </div>
              </div>

              <div
                class="bg-gradient-to-r from-green-900 to-green-800 p-4 rounded-lg border border-green-600"
              >
                <label
                  class="block text-sm md:text-base lg:text-lg font-medium text-green-200 mb-2"
                >
                  <i class="mdi mdi-calculator mr-2"></i>ยอดรวม
                </label>
                <p class="text-white text-xl md:text-2xl lg:text-3xl font-bold">
                  {{ formatCurrency(orderData.totalAmount) }}
                </p>
              </div>
            </div>

            <!-- Customer Information -->
            <div class="space-y-4 lg:space-y-6">
              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-account"></i>ข้อมูลลูกค้า
                </h3>
                <div class="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      ชื่อ
                    </label>
                    <p
                      v-if="orderData.status === 'PAID'"
                      class="text-white text-base md:text-lg font-semibold"
                    >
                      {{ orderData.customerName }}
                    </p>
                    <BaseInput
                      v-else
                      v-model="formData.newCustomerName"
                      class="bg-white text-black"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      เบอร์โทร
                    </label>
                    <p
                      v-if="orderData.status === 'PAID'"
                      class="text-white text-base md:text-lg font-mono"
                    >
                      {{ orderData.customerPhone }}
                    </p>
                    <BaseInput
                      v-else
                      v-model="formData.newCustomerPhone"
                      class="bg-white text-black"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      อีเมล
                    </label>
                    <p
                      v-if="orderData.status === 'PAID'"
                      class="text-white text-base md:text-lg font-mono break-all"
                    >
                      {{ orderData.email }}
                    </p>
                    <BaseInput
                      v-else
                      v-model="formData.newCustomerEmail"
                      class="bg-white text-black"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-handshake"></i>ข้อมูลการแนะนำ
                </h3>
                <div class="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      รหัสผู้แนะนำ
                    </label>
                    <p
                      v-if="orderData.status === 'PAID'"
                      class="text-white text-base md:text-lg font-semibold"
                    >
                      {{ orderData.referrerCode || "ไม่มีข้อมูล" }}
                    </p>
                    <BaseInput
                      v-else
                      v-model="formData.newReferrerCode"
                      class="bg-white text-black"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      แหล่งที่มา
                    </label>
                    <p
                      v-if="orderData.status === 'PAID'"
                      class="text-white text-base md:text-lg font-semibold"
                    >
                      {{ orderData.source }}
                    </p>
                    <BaseInput
                      v-else
                      v-model="formData.source"
                      class="bg-white text-black"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-credit-card"></i>การชำระเงิน
                </h3>
                <div class="grid sm:grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      วิธีการชำระเงิน
                    </label>
                    <p class="text-white text-base md:text-lg font-semibold">
                      {{ orderData.paymentMethod }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      วันที่แสดง
                    </label>
                    <p class="text-white text-base md:text-lg font-semibold">
                      {{ formatDate(orderData.showDate) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Timestamps and Additional Info -->
            <div class="grid sm:grid-cols-1 md:grid-cols-1 gap-4">
              <div class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700">
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-clock-outline"></i>เวลาและวันที่
                </h3>
                <div class="grid sm:grid-cols-4 md:grid-cols-4 gap-4">
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      สร้างเมื่อ
                    </label>
                    <p class="text-white text-sm md:text-base font-mono">
                      {{ formatDateTime(orderData.createdAt) }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      อัปเดตล่าสุด
                    </label>
                    <p class="text-white text-sm md:text-base font-mono">
                      {{ formatDateTime(orderData.updatedAt) }}
                    </p>
                  </div>
                  <div v-if="orderData.expiresAt">
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      หมดอายุ
                    </label>
                    <p class="text-white text-sm md:text-base font-mono">
                      {{ formatDateTime(orderData.expiresAt) }}
                    </p>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  orderData.standingAdultQty > 0 ||
                  orderData.standingChildQty > 0
                "
                class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700"
              >
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-human-queue"></i>ตั๋วยืน
                </h3>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      ผู้ใหญ่
                    </label>
                    <p class="text-white text-base md:text-lg font-bold">
                      {{ orderData.standingAdultQty }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                    >
                      เด็ก
                    </label>
                    <p class="text-white text-base md:text-lg font-bold">
                      {{ orderData.standingChildQty }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-blue-700">
                  <label
                    class="block text-sm md:text-base font-medium text-gray-300 mb-1"
                  >
                    ยอดรวมตั๋วยืน
                  </label>
                  <p class="text-white text-base md:text-lg font-bold">
                    {{ formatCurrency(orderData.standingTotal) }}
                  </p>
                </div>
              </div>

              <div
                v-if="orderData.note"
                class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700"
              >
                <h3
                  class="text-lg md:text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2"
                >
                  <i class="mdi mdi-note-text"></i>หมายเหตุ
                </h3>
                <p class="text-white text-base md:text-lg">
                  {{ orderData.note }}
                </p>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Seats Information -->
        <BaseCard
          v-if="orderData.seats && orderData.seats.length > 0"
          class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] border-blue-600 shadow-2xl"
        >
          <template #header>
            <h2
              class="text-xl md:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2"
            >
              <i class="mdi mdi-seat-passenger text-blue-400"></i>
              ที่นั่งที่จอง
              <span
                class="text-sm md:text-base bg-blue-600 px-3 py-1 rounded-full"
              >
                {{ orderData.seats.length }} ที่นั่ง
              </span>
            </h2>
          </template>

          <div
            class="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <div
              v-for="seat in orderData.seats"
              :key="seat.id"
              class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700 hover:border-blue-500 transition-colors"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-white text-lg md:text-xl font-bold">
                  {{ seat.seatNumber }}
                </span>
                <i class="mdi mdi-seat text-blue-400 text-xl"></i>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs md:text-sm text-gray-400">Zone:</span>
                <span
                  class="text-blue-300 text-sm md:text-base font-semibold capitalize"
                >
                  {{ seat.zone.name.replace("-", " ") }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Seat Selection -->
        <BaseCard
          class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] border-blue-600 shadow-2xl"
        >
          <template #header>
            <h2
              class="text-xl md:text-2xl xl:text-3xl font-bold text-white flex items-center gap-2"
            >
              <i class="mdi mdi-seat-outline text-blue-400"></i>
              เลือกที่นั่งใหม่
            </h2>
          </template>

          <div class="space-y-6">
            <div
              class="bg-[#0f1f3c] p-4 md:p-6 rounded-lg border border-blue-700"
            >
              <label
                class="text-base md:text-lg lg:text-xl font-medium text-blue-300 mb-4 flex items-center gap-2"
              >
                <i class="mdi mdi-calendar"></i>
                วันที่แสดง
              </label>
              <DatePicker
                v-model="formData.newShowDate"
                :placeholder="'เลือกวันที่'"
                :minDate="new Date()"
                @update:modelValue="handleDateChange"
                class="w-full"
              />
            </div>

            <div
              class="bg-[#0f1f3c] p-4 md:p-6 rounded-lg border border-blue-700"
            >
              <label
                class="text-base md:text-lg lg:text-xl font-medium text-blue-300 mb-4 flex items-center gap-2"
              >
                <i class="mdi mdi-seat"></i>
                ที่นั่งใหม่
              </label>
              <textarea
                v-model="seatIdsText"
                rows="4"
                class="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-white text-base md:text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="ใส่รหัสที่นั่งคั่นด้วยเครื่องหมายจุลภาค เช่น 470, 471, 472, 473"
              />
              <p class="text-sm md:text-base text-gray-400 mt-1">
                เลขที่นั่งเดิม:
                {{ orderData.seats.map((seat) => seat.seatNumber).join(", ") }}
              </p>
              <div
                class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3"
              >
                <p
                  class="text-sm md:text-base text-blue-300 flex items-center gap-2"
                >
                  <i class="mdi mdi-information-outline"></i>
                  ที่นั่งที่เลือก:
                  <span class="font-bold text-white">{{
                    formData.seatIds.length
                  }}</span>
                  ที่นั่ง
                </p>
                <p class="text-xs md:text-sm text-gray-400">
                  จำนวนเดิม: {{ orderData.quantity }} ที่นั่ง
                </p>
              </div>
            </div>

            <div
              v-if="validationErrors.length > 0"
              class="bg-gradient-to-r from-red-900 to-red-800 border border-red-600 rounded-lg p-4 md:p-6 shadow-lg"
            >
              <h3
                class="text-red-200 font-bold mb-3 text-base md:text-lg flex items-center gap-2"
              >
                <i class="mdi mdi-alert-circle-outline text-xl"></i>
                ข้อผิดพลาด
              </h3>
              <ul class="text-red-200 text-sm md:text-base space-y-2">
                <li
                  v-for="error in validationErrors"
                  :key="error"
                  class="flex items-start gap-3 p-2 bg-red-800 bg-opacity-50 rounded"
                >
                  <i
                    class="mdi mdi-close-circle text-red-400 mt-0.5 flex-shrink-0"
                  ></i>
                  <span>{{ error }}</span>
                </li>
              </ul>
            </div>
          </div>
        </BaseCard>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row justify-end gap-4 pt-6">
          <button
            @click="$router.go(-1)"
            class="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 text-base md:text-lg"
          >
            <i class="mdi mdi-arrow-left"></i>
            ยกเลิก
          </button>
          <button
            @click="saveChanges"
            :disabled="!canSave || saving"
            class="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2 shadow-lg text-base md:text-lg"
          >
            <i v-if="saving" class="mdi mdi-loading mdi-spin text-xl"></i>
            <i v-else class="mdi mdi-content-save text-xl"></i>
            {{ saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง" }}
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div
          class="bg-gradient-to-br from-red-900 to-red-800 border border-red-600 rounded-xl p-6 md:p-8 max-w-lg mx-auto shadow-2xl"
        >
          <i
            class="mdi mdi-alert-circle-outline text-red-400 text-5xl md:text-6xl mb-6"
          ></i>
          <h3 class="text-red-200 font-bold mb-4 text-lg md:text-xl">
            ไม่สามารถโหลดข้อมูลออเดอร์ได้
          </h3>
          <p class="text-red-300 text-base md:text-lg mb-6 leading-relaxed">
            {{ error }}
          </p>
          <button
            @click="loadOrder"
            class="px-6 md:px-8 py-3 md:py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto text-base md:text-lg"
          >
            <i class="mdi mdi-refresh"></i>
            ลองใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrder } from "@/composables/useOrder";
import { useToast } from "vue-toastification";
import { formatCurrency } from "@/utils/formatCurrency";
import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const { getOrderById, changeSeats } = useOrder();
const toast = useToast();
const { createSeatedPayment } = usePayments();

// Reactive data
const orderId = route.params.id;
const loading = ref(true);
const saving = ref(false);
const error = ref("");
const orderData = ref(null);

// Form data
const formData = ref({
  seatIds: [],
  newReferrerCode: "",
  newCustomerName: "",
  newCustomerPhone: "",
  newCustomerEmail: "",
  newShowDate: "",
  newSource: "",
  status: "",
  paymentStatus: "",
  totalAmount: 0,
});

// Computed for seat IDs text area
const seatIdsText = ref("");

// Watch for seat IDs text changes
watch(seatIdsText, (newValue) => {
  formData.value.seatIds = newValue
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);
});

const canSave = computed(() => {
  return validationErrors.value.length === 0 && !saving.value;
});

// Status helpers
const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500 text-yellow-900";
    case "BOOKED":
      return "bg-blue-500 text-blue-900";
    case "PAID":
      return "bg-green-500 text-green-900";
    case "CANCELLED":
      return "bg-red-500 text-red-900";
    default:
      return "bg-gray-500 text-gray-900";
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "รอดำเนินการ";
    case "BOOKED":
      return "จองแล้ว";
    case "PAID":
      return "ชำระแล้ว";
    case "CANCELLED":
      return "ยกเลิกแล้ว";
    default:
      return "ไม่ทราบสถานะ";
  }
};

const getPaymentStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-500 text-orange-900";
    case "PAID":
      return "bg-green-500 text-green-900";
    case "FAILED":
      return "bg-red-500 text-red-900";
    case "REFUNDED":
      return "bg-purple-500 text-purple-900";
    default:
      return "bg-gray-500 text-gray-900";
  }
};

const getPaymentStatusLabel = (status) => {
  switch (status) {
    case "PENDING":
      return "รอการชำระ";
    case "PAID":
      return "ชำระแล้ว";
    case "FAILED":
      return "ชำระไม่สำเร็จ";
    case "REFUNDED":
      return "คืนเงินแล้ว";
    default:
      return "ไม่ทราบสถานะ";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const date = new Date(dateString);
  return date.toLocaleString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Load order data
const loadOrder = async () => {
  try {
    loading.value = true;
    error.value = "";

    const data = await getOrderById(orderId);
    orderData.value = data;

    // Initialize form data
    formData.value = {
      seatIds: data.seats.map((seat) => seat.id) || [],
      newReferrerCode: data.referrerCode || "",
      newCustomerName: data.customerName || "",
      newCustomerPhone: data.customerPhone || "",
      newCustomerEmail: data.email || "",
      newShowDate: data.showDate
        ? dayjs(data.showDate).format("YYYY-MM-DD")
        : "",
      totalAmount: data.totalAmount || 0,
      newSource: data.source || "",
      status: data.status,
      paymentStatus: data.paymentStatus,
    };

    seatIdsText.value = data.seats.map((seat) => seat.seatNumber).join(", ");
  } catch (err) {
    error.value = err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  } finally {
    loading.value = false;
  }
};
const handleDateChange = async (newDate) => {
  pageData.showDate = newDate;
};
// Save changes
const saveChanges = async () => {
  if (!canSave.value) return;

  try {
    saving.value = true;

    if (formData.value.status === "PAID") {
      await changeSeats(
        orderId,
        formData.value.seatIds,
        formData.value.newReferrerCode,
        formData.value.newCustomerName,
        formData.value.newCustomerPhone,
        formData.value.newCustomerEmail,
        formData.value.newShowDate,
        formData.value.newSource
      );
      router.push("/admin/orders");
    } else {
      await changeSeats(
        orderId,
        formData.value.seatIds,
        formData.value.newReferrerCode,
        formData.value.newCustomerName,
        formData.value.newCustomerPhone,
        formData.value.newCustomerEmail,
        formData.value.newShowDate,
        formData.value.newSource
      );
      await createSeatedPayment({
        orderId,
        amount: formData.value.totalAmount,
        method: "CASH",
        customerName: formData.value.newCustomerName,
        customerEmail: formData.value.newCustomerEmail,
        customerPhone: formData.value.newCustomerPhone,
        referrerCode: formData.value.newReferrerCode || undefined,
      });
      router.push("/admin/orders");
    }
    toast.success("บันทึกการเปลี่ยนแปลงเรียบร้อย");
  } catch (err) {
    console.error("Error saving changes:", err);
    toast.error("เกิดข้อผิดพลาดในการบันทึกการเปลี่ยนแปลง");
  } finally {
    saving.value = false;
  }
};

// Load order on mount
onMounted(() => {
  loadOrder();
});

// Set page title
useHead({
  title: `แก้ไขที่นั่ง - Order ${orderId}`,
});

const validationErrors = computed(() => {
  const errors = [];

  const originalSeats = orderData.value?.seats || [];
  const originalSeatCount = originalSeats.length;

  const modifiedSeatNumbers = seatIdsText.value
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s);

  if (!modifiedSeatNumbers.length) {
    errors.push("กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง");
  }

  if (orderData.value?.status === "PAID") {
    if (modifiedSeatNumbers.length !== originalSeatCount) {
      errors.push("ออเดอร์ที่ชำระแล้วต้องมีจำนวนที่นั่งเท่าเดิม");
    }
  }

  // Validate customer info only for non-paid orders
  if (orderData.value?.status !== "PAID") {
    if (!formData.value.newCustomerName.trim()) {
      errors.push("กรุณากรอกชื่อลูกค้า");
    }

    // if (!formData.value.newCustomerPhone.trim()) {
    //   errors.push("กรุณากรอกเบอร์โทร");
    // } else if (!/^\d{10}$/.test(formData.value.newCustomerPhone)) {
    //   errors.push("เบอร์โทรต้องเป็นตัวเลข 10 หลัก");
    // }

    // if (!formData.value.newCustomerEmail.trim()) {
    //   errors.push("กรุณากรอกอีเมล");
    // } else if (
    //   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.newCustomerEmail)
    // ) {
    //   errors.push("กรุณากรอกอีเมลที่ถูกต้อง");
    // }
  }

  if (!formData.value.newShowDate) {
    errors.push("กรุณาเลือกวันที่แสดง");
  }

  return errors;
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
