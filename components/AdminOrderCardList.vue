<template>
  <div class="space-y-6">
    <!-- No Orders -->
    <div v-if="orders.length === 0" class="text-center py-12 text-gray-500">
      ไม่พบออเดอร์ตามที่ค้นหา
    </div>

    <!-- Order Cards -->
    <div
      v-for="order in orders"
      :key="order.id"
      class="bg-[#0a1323] rounded-2xl border border-gray-700 shadow hover:shadow-lg transition-all duration-300 p-6 relative text-gray-200"
    >
      <!-- Status Badge -->
      <span
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold"
        :class="{
          'bg-green-500/10 text-green-400': order.status === 'PAID',
          'bg-yellow-500/10 text-yellow-400': order.status === 'BOOKED',
          'bg-red-500/10 text-red-400': order.status === 'CANCELLED',
          'bg-gray-600 text-white': !['PAID', 'BOOKED', 'CANCELLED'].includes(
            order.status
          ),
        }"
      >
        {{ order.status || "-" }}
      </span>

      <!-- ORDER ID -->
      <div class="mb-4">
        <p class="text-[11px] text-gray-400 font-medium uppercase">ORDER ID</p>
        <p
          class="font-mono text-white font-semibold text-sm md:text-base break-all"
        >
          {{ order.id }}
        </p>
      </div>

      <!-- Order Info -->
      <div class="space-y-2 text-sm">
        <p class="flex items-center gap-2">
          <i class="mdi mdi-calendar-range text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">วันที่แสดง:</span>
            {{ formatDate(order.showDate) }}</span
          >
        </p>
        <p class="flex items-center gap-2">
          <i class="mdi mdi-map-marker text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">โซน:</span>
            {{ order.zoneName || "-" }}</span
          >
        </p>
        <p class="flex items-center gap-2">
          <i class="mdi mdi-chair-rolling text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">จำนวนที่นั่ง:</span>
            {{ order.seats?.length || 0 }} ที่นั่ง</span
          >
        </p>
        <p v-if="order.standingTotal > 0" class="flex items-center gap-2">
          <i class="mdi mdi-account-group text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">ตั๋วยืน:</span>
            {{ order.standingAdultQty }} ผู้ใหญ่ /
            {{ order.standingChildQty }} เด็ก</span
          >
        </p>
        <p class="flex items-center gap-2">
          <i class="mdi mdi-currency-thb text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">รวมเงิน:</span>
            {{ order.total?.toLocaleString() }} บาท</span
          >
        </p>
        <p v-if="order.customerName" class="flex items-center gap-2">
          <i class="mdi mdi-account text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">ชื่อผู้สั่งซื้อ:</span>
            {{ order.customerName }}</span
          >
        </p>
        <p v-if="order.payment" class="flex items-center gap-2">
          <i class="mdi mdi-credit-card-outline text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">ช่องทางชำระเงิน:</span>
            {{ order.payment.method }}</span
          >
        </p>
        <p v-if="order.referrer" class="flex items-center gap-2">
          <i class="mdi mdi-account-tie text-blue-400 text-lg"></i>
          <span
            ><span class="font-medium">ผู้แนะนำ:</span>
            {{ order.referrer.name }} ({{ order.referrer.code }})</span
          >
        </p>
        <p
          v-if="order.referrerCommission > 0 || order.standingCommission > 0"
          class="flex items-center gap-2"
        >
          <i class="mdi mdi-cash-multiple text-blue-400 text-lg"></i>
          <span>
            <span class="font-medium">ค่าคอมมิชชั่น:</span>
            {{
              (order.referrerCommission || 0) + (order.standingCommission || 0)
            }}
            บาท
          </span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        :class="[
          'mt-6 w-full flex flex-wrap justify-end gap-x-3 gap-y-2',
          isMobile ? 'flex-col items-stretch' : 'flex-row items-center',
        ]"
      >
        <!-- แก้ไขที่นั่ง -->
        <button
          v-if="
            (order.status === 'PENDING' ||
              order.status === 'BOOKED' ||
              order.status === 'PAID') &&
            order.seats?.length > 0
          "
          class="px-4 py-2 text-sm font-medium border border-orange-500 text-orange-400 rounded-lg flex items-center gap-2 justify-center w-full sm:max-w-[220px] hover:bg-orange-900/20 hover:shadow-sm transition-all duration-200"
          @click="
            () => {
              console.log('Edit button clicked for order:', order);
              $emit('edit-order', order);
            }
          "
        >
          <i class="mdi mdi-pencil text-base"></i>
          แก้ไขที่นั่ง
        </button>

        <!-- เปลี่ยนที่นั่ง -->
        <!-- <button
          v-if="order.status === 'PAID' && order.seats?.length > 0"
          class="px-4 py-2 text-sm font-medium border border-blue-500 text-blue-400 rounded-lg flex items-center gap-2 justify-center w-full sm:max-w-[220px] hover:bg-blue-900/20 hover:shadow-sm transition-all duration-200"
          @click="$emit('change-seats', order)"
        >
          <i class="mdi mdi-swap-horizontal-bold text-base"></i>
          เปลี่ยนที่นั่ง
        </button> -->

        <!-- อัปเดตสถานะ -->
        <button
          v-if="
            order.status === 'BOOKED' ||
            (order.status === 'PENDING' && order.seats?.length == 0)
          "
          class="px-4 py-2 text-sm font-medium border border-purple-500 text-purple-400 rounded-lg flex items-center gap-2 justify-center w-full sm:max-w-[220px] hover:bg-purple-900/20 hover:shadow-sm transition-all duration-200"
          @click="$emit('update-status', order)"
        >
          <i class="mdi mdi-update text-base"></i>
          อัปเดตสถานะ
        </button>

        <!-- ออกตั๋ว -->
        <button
          v-if="order.status === 'PAID'"
          class="px-4 py-2 text-sm font-medium border border-green-500 text-green-400 rounded-lg flex items-center gap-2 justify-center w-full sm:max-w-[220px] hover:bg-green-900/20 hover:shadow-sm transition-all duration-200"
          @click="$emit('generate-tickets', order)"
        >
          <i class="mdi mdi-ticket-confirmation text-base"></i>
          ออกตั๋ว
        </button>

        <!-- ยกเลิก -->
        <button
          v-if="order.status === 'PENDING' || order.status === 'BOOKED'"
          class="px-4 py-2 text-sm font-medium border border-red-500 text-red-400 rounded-lg flex items-center gap-2 justify-center w-full sm:max-w-[220px] hover:bg-red-900/20 hover:shadow-sm transition-all duration-200"
          @click="$emit('cancel-order', order)"
        >
          <i class="mdi mdi-close-circle-outline text-base"></i>
          ยกเลิก
        </button>
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

const statusClass = (status) => {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-700";
    case "BOOKED":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const statusText = (status) => {
  switch (status) {
    case "PAID":
      return "PAID";
    case "BOOKED":
      return "BOOKED";
    case "CANCELLED":
      return "CANCELLED";
    default:
      return status || "-";
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  return dayjs(dateStr).format("YYYY-MM-DD");
};

onMounted(() => {
  handleResize();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
