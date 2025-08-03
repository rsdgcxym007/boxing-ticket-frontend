<template>
  <div class="space-y-3">
    <!-- No Orders -->
    <div
      v-if="orders.length === 0"
      class="bg-white rounded-lg border border-gray-200 p-12 text-center"
    >
      <div
        class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <i class="mdi mdi-package-variant text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">ไม่มีข้อมูลออเดอร์</h3>
      <p class="text-gray-600 text-sm">ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา</p>
    </div>

    <!-- Orders List -->
    <div class="space-y-2">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
      >
        <!-- Compact Header -->
        <div
          class="px-4 py-3 bg-slate-600 text-white flex items-center justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
              <i class="mdi mdi-ticket-confirmation-outline text-sm"></i>
              <div>
                <h3 class="font-bold text-sm">{{ order.orderNumber }}</h3>
                <p class="text-slate-200 text-xs">
                  {{ getTicketTypeLabel(order.ticketType) }} •
                  {{ order.quantity }} ใบ
                  <span v-if="order.customerName" class="ml-2"
                    >• {{ order.customerName }}</span
                  >
                </p>
              </div>
            </div>

            <!-- Status Badges -->
            <div class="flex gap-2">
              <!-- สถานะหลัก -->
              <div
                class="flex items-center gap-1 px-2 py-1 rounded-md border font-semibold text-xs"
                :class="getStatusClass(order.status)"
              >
                <div
                  class="w-2 h-2 rounded-full"
                  :class="getStatusDotColor(order.status)"
                ></div>
                <span>{{ getStatusLabel(order.status) }}</span>
              </div>
              <!-- สถานะการชำระ -->
              <div
                class="flex items-center gap-1 px-2 py-1 rounded-md border font-semibold text-xs"
                :class="getPaymentStatusClass(order.paymentStatus)"
              >
                <div
                  class="w-2 h-2 rounded-full"
                  :class="getPaymentStatusDotColor(order.paymentStatus)"
                ></div>
                <span>{{ getPaymentStatusLabel(order.paymentStatus) }}</span>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="text-right">
            <div class="text-lg font-bold">
              ฿{{ formatCurrency(order.totalAmount) }}
            </div>
            <div class="text-xs text-slate-200">
              <span v-if="getCommission(order) > 0">
                คอม: ฿{{ formatCurrency(getCommission(order)) }} |
              </span>
              สุทธิ: ฿{{
                formatCurrency(order.totalAmount - getCommission(order))
              }}
            </div>
            <div class="text-xs text-slate-300 mt-1">
              {{ getPaymentMethodLabel(order.paymentMethod) }}
              <span v-if="order.referrer?.name" class="ml-2"
                >• {{ order.referrer.name }}</span
              >
            </div>
          </div>
        </div>

        <!-- Compact Body -->
        <div class="px-4 py-3">
          <div
            class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs"
          >
            <!-- ลูกค้า -->
            <div>
              <span class="text-gray-500 font-medium">ลูกค้า</span>
              <div class="text-gray-900 font-medium mt-1">
                <div>{{ order.customerName || "ไม่ระบุ" }}</div>
                <div class="text-gray-600">
                  {{ order.customerPhone || "ไม่ระบุโทร" }}
                </div>
                <div v-if="order.email" class="text-gray-500 text-xs truncate">
                  {{ order.email }}
                </div>
              </div>
            </div>

            <!-- ที่นั่ง/ตั๋ว -->
            <div>
              <span class="text-gray-500 font-medium">{{
                order.seats?.length ? "ที่นั่ง" : "ตั๋วยืน"
              }}</span>
              <div class="text-gray-900 font-medium mt-1">
                <div v-if="order.seats?.length">
                  <span v-if="order.seats.length <= 3">
                    {{ order.seats.map((s) => s.seatNumber).join(", ") }}
                  </span>
                  <span v-else>
                    {{
                      order.seats
                        .slice(0, 2)
                        .map((s) => s.seatNumber)
                        .join(", ")
                    }}... (+{{ order.seats.length - 2 }})
                  </span>
                  <div class="text-gray-600">
                    {{
                      order.seats[0]?.zone.name.replace("-", " ").toUpperCase()
                    }}
                  </div>
                  <div class="text-gray-500 text-xs">
                    ฿{{ formatCurrency(order.price) }}/ใบ
                  </div>
                </div>
                <div
                  v-else-if="order.standingAdultQty || order.standingChildQty"
                >
                  <span v-if="order.standingAdultQty"
                    >ผู้ใหญ่: {{ order.standingAdultQty }}</span
                  >
                  <span v-if="order.standingChildQty" class="ml-2"
                    >เด็ก: {{ order.standingChildQty }}</span
                  >
                  <div class="text-gray-500 text-xs">
                    ฿{{ formatCurrency(order.price) }}/ใบ
                  </div>
                </div>
              </div>
            </div>

            <!-- สร้าง/ชำระ -->
            <div>
              <span class="text-gray-500 font-medium">สร้าง/ชำระ</span>
              <div class="text-gray-900 font-medium mt-1">
                <div>{{ order.createdByName || "-" }}</div>
                <div class="text-gray-600">{{ order.paidByName || "-" }}</div>
                <div class="text-gray-500 text-xs">
                  {{ getPurchaseTypeLabel(order.purchaseType) }}
                </div>
              </div>
            </div>

            <!-- วันที่/วิธีชำระ -->
            <div>
              <span class="text-gray-500 font-medium">วันที่/วิธี</span>
              <div class="text-gray-900 font-medium mt-1">
                <div>{{ order.showDate }}</div>
                <div class="text-gray-600">
                  {{ getPaymentMethodLabel(order.paymentMethod) }}
                </div>
              </div>
            </div>

            <!-- ผู้แนะนำ/ช่องทาง -->
            <div>
              <span class="text-gray-500 font-medium">แนะนำ/ช่องทาง</span>
              <div class="text-gray-900 font-medium mt-1">
                <div>{{ order.referrer?.name || "ไม่มี" }}</div>
                <div class="text-gray-600">
                  {{ getSourceLabel(order.source) }}
                </div>
                <div
                  v-if="getCommission(order) > 0"
                  class="text-blue-600 text-xs font-medium"
                >
                  คอม: ฿{{ formatCurrency(getCommission(order)) }}
                </div>
              </div>
            </div>

            <!-- เวลา/สถานะ -->
            <div>
              <span class="text-gray-500 font-medium">สร้างเมื่อ</span>
              <div class="text-gray-900 font-medium mt-1">
                <div>{{ formatDate(order.createdAt) }}</div>
                <div class="text-gray-600">
                  {{ formatTime(order.createdAt) }}
                </div>
                <div class="text-xs mt-1">
                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                    :class="getStatusClass(order.status)"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getStatusDotColor(order.status)"
                    ></div>
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- การเงิน -->
            <div>
              <span class="text-gray-500 font-medium">การเงิน</span>
              <div class="text-gray-900 font-medium mt-1">
                <div class="text-green-700 font-bold">
                  ฿{{ formatCurrency(order.totalAmount) }}
                </div>
                <div class="text-gray-600 text-xs">
                  สุทธิ: ฿{{
                    formatCurrency(order.totalAmount - getCommission(order))
                  }}
                </div>
                <div class="text-xs mt-1">
                  <span
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                    :class="getPaymentStatusClass(order.paymentStatus)"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full"
                      :class="getPaymentStatusDotColor(order.paymentStatus)"
                    ></div>
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- หมายเหตุ (ถ้ามี) -->
          <div v-if="order.note" class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex items-start gap-2 bg-yellow-50 rounded p-2">
              <i class="mdi mdi-note-text text-yellow-600 text-sm mt-0.5"></i>
              <div class="text-xs">
                <span class="text-yellow-800 font-medium">หมายเหตุ:</span>
                <span class="text-yellow-700 ml-1">{{ order.note }}</span>
              </div>
            </div>
          </div>

          <!-- ปุ่มดำเนินการ -->
          <div
            class="mt-3 pt-3 border-t border-gray-200 flex justify-end gap-2"
          >
            <button
              v-if="!['CANCELLED', 'EXPIRED'].includes(order.status)"
              @click="$emit('edit-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors"
            >
              <i class="mdi mdi-pencil-outline"></i>
              <span>แก้ไข</span>
            </button>
            <button
              v-if="
                order.status === OrderStatus.PAID &&
                order.paymentStatus === PaymentStatus.PAID
              "
              @click="$emit('generate-tickets', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
            >
              <i class="mdi mdi-ticket-confirmation-outline"></i>
              <span>ออกตั๋ว</span>
            </button>
            <button
              v-if="order.status !== OrderStatus.CANCELLED"
              @click="$emit('cancel-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
            >
              <i class="mdi mdi-close-circle-outline"></i>
              <span>ยกเลิก</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Pagination -->
  <nav v-if="totalPages > 1" class="flex justify-center mt-8">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <ul class="inline-flex items-center space-x-2">
        <li>
          <button
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            :disabled="props.page === 1"
            @click="emit('update:page', props.page - 1)"
          >
            <i class="mdi mdi-chevron-left"></i>
          </button>
        </li>
        <li v-for="page in paginationNumbers" :key="page">
          <button
            v-if="page !== '...'"
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === page
                ? 'bg-slate-600 text-white border-slate-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            @click="emit('update:page', page)"
          >
            {{ page }}
          </button>
          <span
            v-else
            class="flex items-center justify-center w-10 h-10 text-gray-400"
            >...</span
          >
        </li>
        <li>
          <button
            class="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors border"
            :class="
              props.page === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            :disabled="props.page === totalPages"
            @click="emit('update:page', props.page + 1)"
          >
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import {
  getStatusConfig,
  getPaymentStatusConfig,
} from "../utils/orderStatusUtils";
import { formatCurrency as currencyFormatter } from "../utils/formatCurrency";
import { OrderStatus, PaymentStatus, TicketType } from "../types/Enums";
import dayjs from "dayjs";

const props = defineProps<{
  orders: any[];
  page: number;
  hasNext: boolean;
  total: number;
  perPage: number;
}>();

const emit = defineEmits([
  "update:page",
  "change-seats",
  "update-status",
  "cancel-order",
  "generate-tickets",
  "edit-order",
]);

const isMobile = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

const totalPages = computed(() =>
  props.total && props.perPage ? Math.ceil(props.total / props.perPage) : 1
);

const paginationNumbers = computed(() => {
  const current: number = typeof props.page === "number" ? props.page : 1;
  const total: number = totalPages.value;
  const pages: Array<number | string> = [];

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return pages;
});

// Helper functions
const isRingsideOrder = (order: any) => {
  return order.ticketType === TicketType.RINGSIDE
    ? order.seats?.map((seat: any) => seat.seatNumber).join(", ") ||
        "ไม่มีที่นั่ง"
    : order.ticketType === TicketType.STADIUM
    ? order.seats?.map((seat: any) => seat.seatNumber).join(", ") ||
      "ไม่มีที่นั่ง"
    : "ตั๋วยืน";
};

const getTicketTypeLabel = (type) => {
  switch (type) {
    case "RINGSIDE":
      return "ริงไซด์";
    case "STANDING":
      return "ยืน";
    default:
      return type;
  }
};

// Status helpers with dot colors for cleaner look
const getStatusDotColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-400";
    case "BOOKED":
      return "bg-blue-400";
    case "PAID":
      return "bg-green-400";
    case "CANCELLED":
      return "bg-red-400";
    case "EXPIRED":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getPaymentStatusDotColor = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-400";
    case "PAID":
      return "bg-green-400";
    case "FAILED":
      return "bg-red-400";
    case "REFUNDED":
      return "bg-purple-400";
    case "CANCELLED":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};

// Status helpers
const getStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "BOOKED":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "PAID":
      return "bg-green-100 text-green-800 border-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
    case "EXPIRED":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

const getStatusTextClass = (status) => {
  switch (status) {
    case "PENDING":
      return "text-yellow-100";
    case "BOOKED":
      return "text-blue-100";
    case "PAID":
      return "text-green-100";
    case "CANCELLED":
      return "text-red-100";
    case "EXPIRED":
      return "text-gray-100";
    default:
      return "text-white";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "PENDING":
      return "mdi mdi-clock-outline";
    case "BOOKED":
      return "mdi mdi-bookmark-check";
    case "PAID":
      return "mdi mdi-check-circle";
    case "CANCELLED":
      return "mdi mdi-close-circle";
    case "EXPIRED":
      return "mdi mdi-timer-off";
    default:
      return "mdi mdi-help-circle";
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
    case "EXPIRED":
      return "หมดอายุ";
    default:
      return "ไม่ทราบสถานะ";
  }
};

const getPaymentStatusClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "PAID":
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-300";
    case "REFUNDED":
      return "bg-purple-100 text-purple-800 border-purple-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

const getPaymentStatusTextClass = (status) => {
  switch (status) {
    case "PENDING":
      return "text-orange-100";
    case "PAID":
      return "text-green-100";
    case "FAILED":
      return "text-red-100";
    case "REFUNDED":
      return "text-purple-100";
    case "CANCELLED":
      return "text-red-100";
    default:
      return "text-white";
  }
};

const getPaymentStatusIcon = (status) => {
  switch (status) {
    case "PENDING":
      return "mdi mdi-timer-sand";
    case "PAID":
      return "mdi mdi-check-circle";
    case "FAILED":
      return "mdi mdi-close-circle";
    case "REFUNDED":
      return "mdi mdi-undo";
    case "CANCELLED":
      return "mdi mdi-cancel";
    default:
      return "mdi mdi-help-circle";
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
    case "CANCELLED":
      return "ยกเลิกการชำระ";
    default:
      return "ไม่ทราบสถานะ";
  }
};

const getPaymentMethodLabel = (method) => {
  switch (method) {
    case "CASH":
      return "เงินสด";
    case "CREDIT_CARD":
      return "บัตรเครดิต";
    case "TRANSFER":
      return "โอนเงิน";
    case "QR":
      return "QR Code";
    default:
      return method || "ไม่ระบุ";
  }
};

const getSourceLabel = (source) => {
  switch (source) {
    case "WEBSITE":
      return "เว็บไซต์";
    case "FACEBOOK":
      return "Facebook";
    case "LINE":
      return "LINE";
    case "PHONE":
      return "โทรศัพท์";
    case "WALK_IN":
      return "Walk-in";
    case "DIRECT":
      return "ตรง";
    case "OTHER":
      return "อื่นๆ";
    default:
      return source || "ไม่ระบุ";
  }
};

const getPurchaseTypeLabel = (type) => {
  switch (type) {
    case "BOOKING":
      return "จอง";
    case "ONSITE":
      return "หน้างาน";
    case "ONLINE":
      return "ออนไลน์";
    default:
      return type || "ไม่ระบุ";
  }
};

const formatCurrency = (amount) => {
  if (!amount) return "0";
  return Number(amount).toLocaleString();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "ไม่ระบุ";
  return dayjs(dateStr).format("DD/MM/YYYY");
};

const formatTime = (dateStr) => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("HH:mm");
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "ไม่ระบุ";
  return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
};

const getCommission = (order) => {
  if (order.ticketType === TicketType.RINGSIDE) {
    return order.referrerCommission || 0;
  } else if (order.ticketType === TicketType.STANDING) {
    return order.standingCommission || 0;
  }
  return 0;
};
</script>
