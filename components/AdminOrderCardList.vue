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
    <div class="grid gap-6">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-slate-800 border border-slate-700 rounded-2xl shadow-md overflow-hidden"
      >
        <!-- Header -->
        <div
          class="bg-slate-700/70 p-4 flex flex-col md:flex-row md:justify-between gap-2"
        >
          <div>
            <h3 class="text-white text-sm font-semibold tracking-wide">
              เลขที่ออเดอร์: {{ order.orderNumber }}
            </h3>
            <div class="flex gap-2 mt-2 flex-wrap">
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium border"
                :class="getStatusClass(order.status)"
              >
                สถานะ: {{ getStatusLabel(order.status) }}
              </span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium border"
                :class="getPaymentStatusClass(order.paymentStatus)"
              >
                ชำระเงิน: {{ getPaymentStatusLabel(order.paymentStatus) }}
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-gray-100">
              รวมเงิน: ฿{{ formatCurrency(order.totalAmount) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ order.quantity }} ใบ ({{ order.ticketType }})
            </div>
          </div>
        </div>

        <!-- Body -->
        <div
          class="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-200"
        >
          <!-- ข้อมูลลูกค้า -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
              ข้อมูลลูกค้า
            </p>
            <div class="space-y-1">
              <div class="flex gap-2 items-center">
                <i
                  class="mdi mdi-account-circle-outline text-base text-gray-400"
                ></i>
                <span>{{ order.customerName || "ไม่ระบุชื่อ" }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <i class="mdi mdi-phone-outline text-base text-gray-400"></i>
                <span>{{ order.customerPhone || "ไม่ระบุเบอร์โทร" }}</span>
              </div>
              <div class="flex gap-2 items-center">
                <i class="mdi mdi-email-outline text-base text-gray-400"></i>
                <span>{{ order.email || "ไม่ระบุอีเมล" }}</span>
              </div>
            </div>
          </div>

          <!-- ที่นั่ง -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
              ที่นั่ง
            </p>
            <div v-if="order.seats?.length">
              <div class="flex flex-wrap gap-1 mb-1">
                <span
                  v-for="seat in order.seats.slice(0, 4)"
                  :key="seat.id"
                  class="bg-slate-700 text-gray-100 text-xs rounded px-2 py-1"
                >
                  {{ seat.seatNumber }}
                </span>
                <span
                  v-if="order.seats.length > 4"
                  class="bg-slate-600 text-gray-300 text-xs rounded px-2 py-1"
                >
                  +{{ order.seats.length - 4 }}
                </span>
              </div>
              <div class="text-xs text-gray-400">
                โซน:
                {{ order.seats[0]?.zone.name.replace("-", " ").toUpperCase() }}
              </div>
            </div>
            <div v-if="order.standingAdultQty || order.standingChildQty">
              <div class="flex gap-3">
                <span v-if="order.standingAdultQty"
                  >ผู้ใหญ่: {{ order.standingAdultQty }}</span
                >
                <span v-if="order.standingChildQty"
                  >เด็ก: {{ order.standingChildQty }}</span
                >
              </div>
            </div>
          </div>

          <!-- รายละเอียด -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
              รายละเอียด
            </p>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-calendar-range-outline text-gray-400 text-sm"
                ></i>
                <span>สร้างโดย: {{ order.createdByName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-calendar-range-outline text-gray-400 text-sm"
                ></i>
                <span>ชำระโดย: {{ order.paidByName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-calendar-range-outline text-gray-400 text-sm"
                ></i>
                <span>อัปเดตล่าสุด: {{ order.lastUpdatedByName }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-calendar-range-outline text-gray-400 text-sm"
                ></i>
                <span>วันที่แสดง: {{ order.showDate }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-credit-card-outline text-gray-400 text-sm"
                ></i>
                <span
                  >ชำระผ่าน:
                  {{ getPaymentMethodLabel(order.paymentMethod) }}</span
                >
              </div>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-currency-bdt text-gray-400 text-sm"></i>
                <span>ราคาต่อใบ: ฿{{ formatCurrency(order.price) }}</span>
              </div>
            </div>
          </div>

          <!-- เพิ่มเติม -->
          <div>
            <p class="text-xs font-semibold text-gray-400 uppercase mb-2">
              เพิ่มเติม
            </p>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <i class="mdi mdi-note-outline text-gray-400 text-sm"></i>
                <span>แนะนำโดย: {{ order.referrer?.name || "ไม่มี" }}</span>
              </div>
              <div class="flex items-center gap-2">
                <i class="mdi mdi-percent-outline text-gray-400 text-sm"></i>
                <span>
                  ค่าคอม:
                  {{
                    order.ticketType === "RINGSIDE"
                      ? order.referrerCommission
                      : order.standingCommission || 0
                  }}
                </span>
              </div>
              <div class="flex items-center gap-2">
                <i
                  class="mdi mdi-map-marker-radius-outline text-gray-400 text-sm"
                ></i>
                <span>ช่องทาง: {{ order.source }}</span>
              </div>
              <div class="text-xs text-gray-400">
                สร้างเมื่อ: {{ formatDateTime(order.createdAt) }}
              </div>
            </div>
          </div>
        </div>

        <!-- หมายเหตุ -->
        <div
          v-if="order.note"
          class="border-t border-slate-700 px-4 pt-3 pb-2 bg-slate-800"
        >
          <p class="text-sm text-gray-300">
            <span class="text-gray-400">หมายเหตุ:</span> {{ order.note }}
          </p>
        </div>

        <!-- ปุ่ม -->
        <div class="px-4 py-3 border-t border-slate-700 bg-slate-800">
          <div class="flex flex-wrap justify-end gap-2">
            <button
              v-if="!['CANCELLED', 'EXPIRED'].includes(order.status)"
              @click="$emit('edit-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded text-sm"
            >
              <i class="mdi mdi-pencil-outline text-base"></i>
              <span>แก้ไข</span>
            </button>
            <button
              v-if="order.status === 'PAID' && order.paymentStatus === 'PAID'"
              @click="$emit('generate-tickets', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm"
            >
              <i class="mdi mdi-ticket-confirmation-outline text-base"></i>
              <span>ออกตั๋ว</span>
            </button>
            <button
              v-if="order.status !== 'CANCELLED'"
              @click="$emit('cancel-order', order)"
              class="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white rounded text-sm"
            >
              <i class="mdi mdi-close-circle-outline text-base"></i>
              <span>ยกเลิก</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Pagination -->
  <nav v-if="totalPages > 1" class="flex justify-center mt-8">
    <ul class="inline-flex items-center space-x-1">
      <li>
        <button
          class="px-2 py-1 rounded text-sm"
          :class="
            props.page === 1
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600'
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
          class="px-3 py-1 rounded text-sm font-medium"
          :class="
            props.page === page
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          "
          @click="emit('update:page', page)"
        >
          {{ page }}
        </button>
        <span v-else class="px-2 py-1 text-gray-400">...</span>
      </li>
      <li>
        <button
          class="px-2 py-1 rounded text-sm"
          :class="
            props.page === totalPages
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 text-white hover:bg-slate-600'
          "
          :disabled="props.page === totalPages"
          @click="emit('update:page', props.page + 1)"
        >
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </li>
    </ul>
  </nav>
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
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-300";
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
