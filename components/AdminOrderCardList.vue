<template>
  <div class="space-y-6">
    <!-- No Orders -->
    <div v-if="orders.length === 0" class="text-center py-12">
      <i class="mdi mdi-package-variant text-6xl text-gray-500 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-300 mb-2">
        ไม่มีข้อมูลออเดอร์
      </h3>
      <p class="text-gray-500">ไม่พบออเดอร์ที่ตรงกับเงื่อนไขการค้นหา</p>
    </div>

    <!-- Orders List -->
    <div class="grid md:grid-cols-1 gap-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <!-- Order Header -->
        <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div>
                <h3 class="text-base font-bold text-white">
                  {{ order.orderNumber }}
                </h3>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold border"
                    :class="getStatusClass(order.status)"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                  <span
                    class="px-3 py-1 rounded-full text-xs font-semibold border"
                    :class="getPaymentStatusClass(order.paymentStatus)"
                  >
                    {{ getPaymentStatusLabel(order.paymentStatus) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xl font-bold text-white">
                ฿{{ formatCurrency(order.totalAmount) }}
              </div>
              <div class="text-sm text-slate-300">
                {{ order.quantity }} {{ order.ticketType }}
              </div>
            </div>
          </div>
        </div>

        <!-- Order Details -->
        <div class="p-4">
          <div class="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4">
            <!-- Customer & Contact Info -->
            <div class="space-y-2">
              <h4
                class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                ข้อมูลลูกค้า
              </h4>
              <div class="space-y-1 text-sm">
                <div class="flex items-center gap-2 text-white">
                  <i class="mdi mdi-account text-slate-400 text-sm"></i>
                  <span class="truncate">{{
                    order.customerName || "ไม่ระบุชื่อ"
                  }}</span>
                </div>
                <div class="flex items-center gap-2 text-white">
                  <i class="mdi mdi-phone text-slate-400 text-sm"></i>
                  <span>{{ order.customerPhone || "ไม่ระบุเบอร์โทร" }}</span>
                </div>
                <div class="flex items-center gap-2 text-white">
                  <i class="mdi mdi-email text-slate-400 text-sm"></i>
                  <span class="truncate">{{
                    order.email || "ไม่ระบุอีเมล"
                  }}</span>
                </div>
              </div>
            </div>

            <!-- Seat Information -->
            <div class="space-y-2">
              <h4
                class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                ที่นั่ง
              </h4>
              <div
                v-if="order.seats && order.seats.length > 0"
                class="space-y-1"
              >
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="seat in order.seats.slice(0, 4)"
                    :key="seat.id"
                    class="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs font-medium"
                  >
                    {{ seat.seatNumber }}
                  </span>
                  <span
                    v-if="order.seats.length > 4"
                    class="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs"
                  >
                    +{{ order.seats.length - 4 }}
                  </span>
                </div>
                <div v-if="order.seats[0]?.zone" class="text-xs text-slate-400">
                  Zone:
                  {{ order.seats[0].zone.name.replace("-", " ").toUpperCase() }}
                </div>
              </div>
              <!-- Standing Tickets -->
              <div
                v-if="order.standingAdultQty > 0 || order.standingChildQty > 0"
                class="text-sm text-white"
              >
                <div class="flex gap-3">
                  <span v-if="order.standingAdultQty > 0"
                    >ผู้ใหญ่: {{ order.standingAdultQty }}</span
                  >
                  <span v-if="order.standingChildQty > 0"
                    >เด็ก: {{ order.standingChildQty }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Order Details -->
            <div class="space-y-2">
              <h4
                class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                รายละเอียด
              </h4>
              <div class="space-y-1 text-sm text-white">
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-calendar text-slate-400 text-sm"></i>
                  <span>{{ formatDate(order.showDate) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-credit-card text-slate-400 text-sm"></i>
                  <span>{{ getPaymentMethodLabel(order.paymentMethod) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-cash text-slate-400 text-sm"></i>
                  <span>฿{{ formatCurrency(order.price) }}/ใบ</span>
                </div>
              </div>
            </div>

            <!-- Additional Info -->
            <div class="space-y-2">
              <h4
                class="text-xs font-semibold text-slate-400 uppercase tracking-wide"
              >
                เพิ่มเติม
              </h4>
              <div class="space-y-1 text-sm text-white">
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-tag text-slate-400 text-sm"></i>
                  <span>{{ order.referrerCode || "ไม่มี" }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="mdi mdi-source-branch text-slate-400 text-sm"></i>
                  <span>{{ order.source }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  สร้าง: {{ formatDateTime(order.createdAt) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Note -->
          <div v-if="order.note" class="mt-4 pt-3 border-t border-slate-600">
            <div
              class="text-sm text-slate-300 bg-slate-700 bg-opacity-50 p-2 rounded"
            >
              <span class="text-slate-400">หมายเหตุ:</span> {{ order.note }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="px-4 pb-4">
          <div class="flex flex-wrap gap-2 justify-end">
            <button
              v-if="
                !['CANCELLED', 'EXPIRED'].includes(order.status) &&
                order.ticketType !== 'STANDING'
              "
              @click="$emit('edit-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm font-medium transition-colors"
            >
              <i class="mdi mdi-pencil text-sm"></i>
              <span>แก้ไข</span>
            </button>

            <!-- <button
              v-if="order.status !== 'CANCELLED'"
              @click="$emit('change-seats', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium transition-colors"
            >
              <i class="mdi mdi-seat-passenger text-sm"></i>
              <span>เปลี่ยนที่นั่ง</span>
            </button> -->

            <button
              v-if="
                order.status !== 'PAID' &&
                order.ticketType === 'STANDING' &&
                order.status !== 'CANCELLED' &&
                order.ticketType === 'STANDING'
              "
              @click="$emit('update-status', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded text-sm font-medium transition-colors"
            >
              <i class="mdi mdi-update text-sm"></i>
              <span>อัปเดต</span>
            </button>

            <button
              v-if="order.status === 'PAID' && order.paymentStatus === 'PAID'"
              @click="$emit('generate-tickets', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-sm font-medium transition-colors"
            >
              <i class="mdi mdi-ticket text-sm"></i>
              <span>ออกตั๋ว</span>
            </button>

            <button
              v-if="order.status !== 'CANCELLED'"
              @click="$emit('cancel-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium transition-colors"
            >
              <i class="mdi mdi-cancel text-sm"></i>
              <span>ยกเลิก</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="orders.length > 0"
      class="flex flex-col items-center justify-center gap-3 pt-6"
    >
      <div class="flex flex-wrap justify-center gap-1">
        <button
          class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="page === 1"
          @click="$emit('update:page', page - 1)"
        >
          ◀️ ก่อนหน้า
        </button>

        <button
          v-for="p in paginationNumbers"
          :key="p"
          @click="$emit('update:page', p)"
          :disabled="p === '...'"
          class="px-3 py-1 rounded-md"
          :class="[
            p === '...'
              ? 'cursor-default text-gray-500'
              : page === p
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-gray-800 text-gray-200 hover:bg-gray-700',
          ]"
        >
          {{ p }}
        </button>

        <button
          class="px-4 py-2 bg-gray-700 text-white hover:bg-gray-600 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasNext"
          @click="$emit('update:page', page + 1)"
        >
          ถัดไป ▶️
        </button>
      </div>

      <p class="text-sm text-gray-500">หน้า {{ page }} จาก {{ totalPages }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  orders: Array,
  page: Number,
  hasNext: Boolean,
  total: Number,
  perPage: Number,
});

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
  const current = props.page;
  const total = totalPages.value;
  const pages = [];

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
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
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

const getPaymentMethodLabel = (method) => {
  switch (method) {
    case "CASH":
      return "เงินสด";
    case "CARD":
      return "บัตรเครดิต";
    case "TRANSFER":
      return "โอนเงิน";
    case "QR":
      return "QR Code";
    default:
      return method || "ไม่ระบุ";
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

const formatDateTime = (dateStr) => {
  if (!dateStr) return "ไม่ระบุ";
  return dayjs(dateStr).format("DD/MM/YYYY HH:mm");
};
</script>
