<template>
  <div
    class="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-blue-900"
  >
    <div class="max-w-6xl mx-auto p-4 space-y-4">
      <!-- Header -->
      <div
        class="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-xl shadow-md p-4 border border-blue-200"
      >
        <div class="flex items-center gap-3">
          <button
            @click="$router.go(-1)"
            class="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors text-sm"
          >
            <i class="mdi mdi-arrow-left text-blue-500"></i>
            กลับ
          </button>
          <div>
            <h1 class="text-xl font-bold text-blue-900">
              แก้ไขออเดอร์ {{ orderData?.orderNumber }}
            </h1>
            <p class="text-sm text-blue-700">
              {{ getTicketTypeConfig(orderData?.ticketType).label }} •
              {{ getPurchaseTypeConfig(orderData?.purchaseType).label }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Use dynamic class and icon from config for each status -->
          <span
            :class="
              'px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-sm ' +
              getStatusConfig(orderData?.status).class
            "
          >
            <i :class="'mdi ' + getStatusConfig(orderData?.status).icon"></i>
            <span class="tracking-wide">{{
              getStatusConfig(orderData?.status).label
            }}</span>
          </span>
          <span
            :class="
              'px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-sm ' +
              getPaymentStatusConfig(orderData?.paymentStatus).class
            "
          >
            <i
              :class="
                'mdi ' + getPaymentStatusConfig(orderData?.paymentStatus).icon
              "
            ></i>
            <span class="tracking-wide">{{
              getPaymentStatusConfig(orderData?.paymentStatus).label
            }}</span>
          </span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <BaseLoading :visible="loading" />
      </div>

      <!-- Order Details -->
      <div v-else-if="orderData" class="space-y-4">
        <!-- Summary Cards Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Order Summary -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i
                class="mdi mdi-ticket-confirmation-outline text-blue-500 text-lg"
              ></i>
              <h3 class="font-semibold text-blue-900">ข้อมูลออเดอร์</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">ประเภทตั๋ว:</span>
                <span class="font-medium text-blue-900">{{
                  getTicketTypeConfig(orderData.ticketType).label
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">จำนวน:</span>
                <span class="font-medium text-blue-900"
                  >{{ orderData.quantity }} ที่นั่ง</span
                >
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">ราคารวม:</span>
                <span class="font-bold text-blue-700">{{
                  formatCurrency(orderData.totalAmount)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Info -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i class="mdi mdi-credit-card text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">การชำระเงิน</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-blue-700">วิธีชำระ:</span>
                <span class="font-medium text-blue-900">{{
                  orderData.paymentMethod
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">รับชำระโดย:</span>
                <span class="font-medium text-blue-900">{{
                  orderData.paidByName || "ยังไม่ชำระ"
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-blue-700">วันที่แสดง:</span>
                <span class="font-medium text-blue-900">{{
                  formatThaiDate(orderData.showDate)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Timestamps -->
          <div
            class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
          >
            <div class="flex items-center gap-2 mb-3">
              <i class="mdi mdi-clock-outline text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">เวลาดำเนินการ</h3>
            </div>
            <div class="space-y-2 text-sm">
              <div>
                <span class="text-blue-700">สร้างเมื่อ:</span>
                <div class="font-medium text-blue-900">
                  {{ formatDateTime(orderData.createdAt) }}
                </div>
                <div class="text-xs text-blue-700">
                  โดย {{ orderData.createdByName }}
                </div>
              </div>
              <div v-if="orderData.updatedAt !== orderData.createdAt">
                <span class="text-blue-700">อัปเดตล่าสุด:</span>
                <div class="font-medium text-blue-900">
                  {{ formatDateTime(orderData.updatedAt) }}
                </div>
                <div class="text-xs text-blue-700">
                  โดย {{ orderData.lastUpdatedByName || orderData.paidByName }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Information (if not ONSITE) -->
        <div
          v-if="shouldShowCustomerSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-account text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ข้อมูลลูกค้า</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >ชื่อ</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerName')"
                class="text-blue-900 py-2"
              >
                {{ orderData.customerName || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerName"
                placeholder="กรอกชื่อลูกค้า"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >เบอร์โทร</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerPhone')"
                class="text-blue-900 py-2 font-mono"
              >
                {{ orderData.customerPhone || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerPhone"
                placeholder="กรอกเบอร์โทร"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >อีเมล</label
              >
              <div
                v-if="!canEditField(orderData, 'newCustomerEmail')"
                class="text-blue-900 py-2 font-mono text-sm break-all"
              >
                {{ orderData.email || "-" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newCustomerEmail"
                placeholder="กรอกอีเมล"
                type="email"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
          </div>
        </div>

        <!-- Referrer Information -->
        <div
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-handshake text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ข้อมูลการแนะนำ</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >รหัสผู้แนะนำ</label
              >
              <div
                v-if="!canEditField(orderData, 'newReferrerCode')"
                class="text-blue-900 py-2"
              >
                {{ orderData.referrer?.name || "ไม่มีข้อมูล" }}
              </div>
              <BaseInput
                v-else
                v-model="formData.newReferrerCode"
                placeholder="กรอกรหัสผู้แนะนำ"
                class="bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >ค่าคอมมิชชั่น</label
              >
              <div class="text-blue-900 py-2">
                {{
                  orderData.ticketType === TicketType.RINGSIDE
                    ? orderData.referrerCommission
                    : orderData.standingCommission || 0
                }}
                บาท
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-blue-700 mb-1"
                >แหล่งที่มา</label
              >
              <div
                v-if="!canEditField(orderData, 'newSource')"
                class="text-blue-900 py-2"
              >
                {{ orderData.source }}
              </div>
              <BaseSelect
                v-else
                v-model="formData.newSource"
                :options="sourceOptions"
                class="bg-blue-50 border-blue-200 text-blue-900 w-full"
              />
            </div>
          </div>
        </div>

        <!-- Seats Information (if not STANDING) -->
        <div
          v-if="shouldShowSeatsSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="mdi mdi-seat-passenger text-blue-500 text-lg"></i>
              <h3 class="font-semibold text-blue-900">ที่นั่งที่จอง</h3>
              <span
                class="bg-blue-200 text-blue-900 px-2 py-1 rounded-full text-xs font-medium"
                >{{ orderData.seats.length }} ที่นั่ง</span
              >
            </div>
          </div>
          <div
            class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
          >
            <div
              v-for="seat in orderData.seats"
              :key="seat.id"
              class="bg-blue-50 border border-blue-200 rounded-md p-2 text-center"
            >
              <div class="font-bold text-blue-900">{{ seat.seatNumber }}</div>
              <div class="text-xs text-blue-700 capitalize">
                {{ seat.zone.name.replace("-", " ") }}
              </div>
            </div>
          </div>
        </div>

        <!-- Standing Tickets (if STANDING) -->
        <div
          v-if="shouldShowStandingSection(orderData)"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-human-queue text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">ตั๋วยืน</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-2xl font-bold text-blue-700">
                {{ orderData.standingAdultQty }}
              </div>
              <div class="text-sm text-blue-700">ผู้ใหญ่</div>
            </div>
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-2xl font-bold text-blue-700">
                {{ orderData.standingChildQty }}
              </div>
              <div class="text-sm text-blue-700">เด็ก</div>
            </div>
            <div class="text-center p-4 bg-blue-200 rounded-lg shadow-sm">
              <div class="text-lg font-bold text-blue-700">
                {{ formatCurrency(orderData.standingTotal) }}
              </div>
              <div class="text-sm text-blue-700">ยอดรวม</div>
            </div>
          </div>
        </div>

        <!-- Edit Section -->
        <div
          v-if="canEditAnything"
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-4"
        >
          <div class="flex items-center gap-2 mb-4">
            <i class="mdi mdi-pencil text-blue-500 text-lg"></i>
            <h3 class="font-semibold text-blue-900">แก้ไขข้อมูล</h3>
          </div>

          <div class="space-y-4">
            <!-- Date Selection -->
            <div v-if="canEditField(orderData, 'newShowDate')">
              <label class="block text-sm font-medium text-blue-700 mb-2"
                >วันที่แสดง</label
              >
              <DatePicker
                v-model="formData.newShowDate"
                placeholder="เลือกวันที่"
                :minDate="new Date()"
                @update:modelValue="handleDateChange"
                class="w-full max-w-md bg-blue-50 border-blue-200 text-blue-900"
              />
            </div>

            <!-- Seat Selection (only for RINGSIDE) -->
            <div
              v-if="
                canEditField(orderData, 'seatIds') &&
                shouldShowSeatsSection(orderData)
              "
            >
              <label class="block text-sm font-medium text-blue-700 mb-2"
                >ที่นั่งใหม่</label
              >
              <textarea
                v-model="seatIdsText"
                rows="3"
                class="w-full p-3 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-blue-50 text-blue-900"
                placeholder="ใส่หมายเลขที่นั่งคั่นด้วยเครื่องหมายจุลภาค เช่น 470, 471, 472"
              />
              <div
                class="flex justify-between items-center mt-2 text-sm text-blue-700"
              >
                <span
                  >ที่นั่งเดิม:
                  {{
                    orderData.seats.map((seat) => seat.seatNumber).join(", ")
                  }}</span
                >
                <span
                  >ที่นั่งที่เลือก: {{ formData.seatIds.length }} ที่นั่ง</span
                >
              </div>
            </div>

            <!-- Validation Errors -->
            <div
              v-if="validationErrors.length > 0"
              class="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm"
            >
              <div
                class="flex items-center gap-2 text-blue-900 font-medium mb-2"
              >
                <i class="mdi mdi-alert-circle-outline"></i>
                ข้อผิดพลาด
              </div>
              <ul class="text-blue-700 text-sm space-y-1">
                <li
                  v-for="error in validationErrors"
                  :key="error"
                  class="flex items-start gap-2"
                >
                  <i
                    class="mdi mdi-close-circle text-blue-700 mt-0.5 text-xs"
                  ></i>
                  {{ error }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="$router.go(-1)"
            class="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-md transition-colors"
          >
            ยกเลิก
          </button>
          <button
            v-if="canEditAnything"
            @click="saveChanges"
            :disabled="!canSave || saving"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-200 text-white font-medium rounded-md transition-colors flex items-center gap-2 shadow-md"
          >
            <i v-if="saving" class="mdi mdi-loading mdi-spin"></i>
            <i v-else class="mdi mdi-content-save"></i>
            {{ saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง" }}
          </button>
        </div>
      </div>
      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div
          class="bg-white/90 rounded-xl shadow-md border border-blue-200 p-8 max-w-md mx-auto"
        >
          <i
            class="mdi mdi-alert-circle-outline text-blue-500 text-4xl mb-4"
          ></i>
          <h3 class="text-blue-700 font-bold mb-2 text-lg">
            ไม่สามารถโหลดข้อมูลออเดอร์ได้
          </h3>
          <p class="text-blue-700 mb-4">{{ error }}</p>
          <button
            @click="loadOrder"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors inline-flex items-center gap-2"
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
// เพิ่ม middleware
definePageMeta({
  middleware: ["only-admin-staff"],
});

import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrder } from "@/composables/useOrder";
import { usePayments } from "@/composables/usePayments";
import { useSingleToast } from "@/composables/useSingleToast";
import { formatCurrency } from "@/utils/formatCurrency";
import {
  getStatusConfig,
  getPaymentStatusConfig,
  getTicketTypeConfig,
  getPurchaseTypeConfig,
  canEditField,
  shouldShowField,
  shouldShowSeatsSection,
  shouldShowCustomerSection,
  shouldShowStandingSection,
} from "@/utils/orderStatusUtils";
import { OrderStatus, TicketType, OrderPurchaseType } from "@/types/Enums";
import dayjs from "dayjs";
const route = useRoute();
const router = useRouter();
const { getOrderById, changeSeats } = useOrder();
const { showToast } = useSingleToast();
const { createSeatedPayment } = usePayments();
const isShowModal = ref(false);
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

// Computed to check if anything can be edited
const canEditAnything = computed(() => {
  if (!orderData.value) return false;

  // Check if any field can be edited
  const editableFields = [
    "seatIds",
    "newShowDate",
    "newReferrerCode",
    "newCustomerName",
    "newCustomerPhone",
    "newCustomerEmail",
    "newSource",
  ];

  return editableFields.some((field) => canEditField(orderData.value, field));
});

// Source options for select
const sourceOptions = [
  { value: "WEBSITE", label: "เว็บไซต์" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "LINE", label: "LINE" },
  { value: "PHONE", label: "โทรศัพท์" },
  { value: "WALK_IN", label: "Walk-in" },
  { value: "OTHER", label: "อื่นๆ" },
];

// Format date to DD-MM-YYYY for Thai display
const formatThaiDate = (dateString) => {
  if (!dateString) return "ไม่มีข้อมูล";
  const d = dayjs(dateString, ["YYYY-MM-DD", "DD/MM/YYYY", "DD-MM-YYYY"]);
  return d.isValid() ? d.format("DD-MM-YYYY") : dateString;
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

    console.log("orderData", orderData.value);

    // Initialize form data
    // Normalize showDate to YYYY-MM-DD for DatePicker (always)
    let normalizedShowDate = "";
    if (data.showDate) {
      // Manual parse DD/MM/YYYY to YYYY-MM-DD
      const ddmmyyyy = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
      const match = data.showDate.match(ddmmyyyy);
      if (match) {
        // match[1]=day, match[2]=month, match[3]=year
        normalizedShowDate = `${match[3]}-${match[2]}-${match[1]}`;
      } else {
        // fallback to dayjs
        let d = dayjs(data.showDate, "YYYY-MM-DD", true);
        if (!d.isValid()) {
          d = dayjs(data.showDate);
        }
        normalizedShowDate = d.isValid() ? d.format("YYYY-MM-DD") : "";
      }
    }
    formData.value = {
      seatIds: data.seats.map((seat) => seat.id) || [],
      newReferrerCode: data.referrerCode || "",
      newCustomerName: data.customerName || "",
      newCustomerPhone: data.customerPhone || "",
      newCustomerEmail: data.email || "",
      newShowDate: normalizedShowDate,
      totalAmount: data.totalAmount || 0,
      newSource: data.source || "",
      status: data.status,
      paymentStatus: data.paymentStatus,
    };
    console.log(" formData.value", formData.value);

    seatIdsText.value = data.seats.map((seat) => seat.seatNumber).join(", ");
  } catch (err) {
    error.value = err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล";
  } finally {
    loading.value = false;
  }
};
const handleDateChange = async (newDate) => {
  // Always convert to YYYY-MM-DD for both display and value
  const d = dayjs(newDate);
  formData.value.newShowDate = d.isValid() ? d.format("YYYY-MM-DD") : newDate;
};
// Save changes
const saveChanges = async () => {
  if (!canSave.value) return;

  try {
    saving.value = true;

    // Always send newShowDate in YYYY-MM-DD format
    let sendShowDate = formData.value.newShowDate;
    if (sendShowDate) {
      const d = dayjs(sendShowDate);
      sendShowDate = d.isValid() ? d.format("YYYY-MM-DD") : sendShowDate;
    }

    if (formData.value.status === OrderStatus.PAID) {
      await changeSeats(
        orderId,
        formData.value.seatIds,
        formData.value.newReferrerCode,
        formData.value.newCustomerName,
        formData.value.newCustomerPhone,
        formData.value.newCustomerEmail,
        sendShowDate,
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
        sendShowDate,
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
    showToast("success", "บันทึกการเปลี่ยนแปลงเรียบร้อย");
  } catch (err) {
    console.error("Error saving changes:", err);
    showToast("error", err.message);
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

  if (!modifiedSeatNumbers.length && canEditField(orderData.value, "seatIds")) {
    errors.push("กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง");
  }

  // For PAID orders that are not (RINGSIDE + non-ONSITE), seat count must match
  if (orderData.value?.status === OrderStatus.PAID) {
    const isRingsideNonOnsite =
      orderData.value?.ticketType === TicketType.RINGSIDE &&
      orderData.value?.purchaseType !== OrderPurchaseType.ONSITE;

    if (
      !isRingsideNonOnsite &&
      modifiedSeatNumbers.length !== originalSeatCount
    ) {
      errors.push("ออเดอร์ที่ชำระแล้วต้องมีจำนวนที่นั่งเท่าเดิม");
    }
  }

  // Validate customer info only for editable fields
  if (
    canEditField(orderData.value, "newCustomerName") &&
    !formData.value.newCustomerName.trim()
  ) {
    errors.push("กรุณากรอกชื่อลูกค้า");
  }

  if (
    canEditField(orderData.value, "newShowDate") &&
    !formData.value.newShowDate
  ) {
    errors.push("กรุณาเลือกวันที่แสดง");
  }

  return errors;
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
