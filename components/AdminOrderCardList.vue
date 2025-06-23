<template>
  <div class="space-y-4">
    <!-- No orders -->
    <div
      v-if="orders.length === 0"
      class="text-center py-12 text-gray-400 text-dynamic"
    >
      ไม่พบออเดอร์ตามที่ค้นหา
    </div>

    <!-- Order list -->
    <div
      v-for="order in orders"
      :key="order.id"
      class="bg-white rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300"
    >
      <div class="flex justify-between items-start flex-wrap gap-2">
        <div class="flex-1 min-w-0">
          <p class="text-[11px] md:text-sm text-gray-400 font-medium uppercase">
            ORDER ID
          </p>
          <p
            class="font-mono text-gray-800 font-semibold truncate text-dynamic leading-snug"
            :title="order.id"
          >
            {{ order.id }}
          </p>
        </div>
        <div class="shrink-0">
          <span
            class="px-3 py-1 rounded-full font-medium whitespace-nowrap text-dynamic"
            :class="statusClass(order.status)"
          >
            {{ statusText(order.status) }}
          </span>
        </div>
      </div>

      <div class="mt-4 text-dynamic text-gray-700 leading-relaxed space-y-1">
        <p>
          📅 <span class="font-medium">วันที่แสดง:</span>
          {{ formatDate(order.showDate) }}
        </p>
        <p>
          📍 <span class="font-medium">โซน:</span> {{ order.zoneName || "-" }}
        </p>
        <p>
          💺 <span class="font-medium">จำนวนที่นั่ง:</span>
          {{ order.seats?.length || 0 }} ที่นั่ง
        </p>
        <p>
          💰 <span class="font-medium">รวมเงิน:</span>
          {{ order.total?.toLocaleString() }} บาท
        </p>
      </div>

      <!-- Action Buttons -->
      <div
        :class="[
          'mt-4 gap-2 w-full',
          isMobile ? 'flex flex-col' : 'flex justify-end items-center flex-row',
        ]"
      >
        <!-- ปุ่มเปลี่ยนที่นั่ง -->
        <button
          v-if="order.status === 'PAID'"
          class="px-4 py-2 border border-blue-500 text-blue-600 rounded-lg flex items-center gap-2 justify-center w-full md:w-auto hover:bg-blue-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out"
          @click="$emit('change-seats', order)"
        >
          เปลี่ยนที่นั่ง
        </button>

        <!-- ปุ่มอัปเดตสถานะ -->
        <button
          v-if="order.status === 'BOOKED'"
          class="px-4 py-2 border border-purple-500 text-purple-600 rounded-lg flex items-center gap-2 justify-center w-full md:w-auto hover:bg-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out"
          @click="$emit('update-status', order)"
        >
          อัปเดตสถานะ
        </button>

        <button
          v-if="order.status === 'PENDING'"
          class="px-4 py-2 border border-purple-500 text-purple-600 rounded-lg flex items-center gap-2 justify-center w-full md:w-auto hover:bg-purple-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ease-in-out"
          @click="$emit('cancel-order', order)"
        >
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
          class="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
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
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300',
          ]"
        >
          {{ p }}
        </button>

        <button
          class="px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!hasNext"
          @click="$emit('update:page', page + 1)"
        >
          ถัดไป ▶️
        </button>
      </div>

      <p class="text-sm text-gray-400">หน้า {{ page }} จาก {{ totalPages }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
const props = defineProps({
  orders: Array,
  page: Number,
  hasNext: Boolean,
  total: Number,
  perPage: Number,
});
const isMobile = ref(false);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};
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
