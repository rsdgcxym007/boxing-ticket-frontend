<template>
  <div
    class="bg-[#0c1a30] min-h-screen text-white px-4 md:px-10 pb-16 pt-6 space-y-6"
  >
    <div class="flex flex-wrap items-center gap-10">
      <button
        @click="$router.back()"
        class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-6 sm:mt-0"
      >
        <i class="mdi mdi-arrow-left text-lg"></i>
        ย้อนกลับ
      </button>
      <h4 class="text-2xl font-bold tracking-tight">
        รายละเอียดผู้แนะนำ:
        <span class="text-blue-400">{{ referrerName }}</span>
      </h4>
      <NuxtLink
        :to="`/admin/referrer/referrer-preview/${route.params.id}`"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        ดูตัวอย่าง PDF
      </NuxtLink>
    </div>

    <!-- Header -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div
        class="bg-gradient-to-br from-[#121d35] to-[#0c152b] rounded-2xl shadow-2xl border border-white/10 p-6 space-y-6"
      >
        <!-- Filter Row -->
        <div class="flex flex-row flex-wrap items-end gap-4">
          <!-- Start Date -->
          <div class="flex-1 min-w-[200px]">
            <label
              class="text-sm font-semibold text-white flex items-center gap-1 mb-1"
            >
              <i class="mdi mdi-calendar-start text-indigo-400"></i>
              วันที่เริ่ม
            </label>
            <DatePicker
              v-model="filters.start"
              placeholder="เลือกวันที่เริ่ม"
              minDate=""
              input-class-name="w-full px-4 py-2 text-black rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- End Date -->
          <div class="flex-1 min-w-[200px]">
            <label
              class="text-sm font-semibold text-white flex items-center gap-1 mb-1"
            >
              <i class="mdi mdi-calendar-end text-indigo-400"></i>
              ถึงวันที่
            </label>
            <DatePicker
              v-model="filters.end"
              minDate=""
              placeholder="เลือกวันที่สิ้นสุด"
              input-class-name="w-full px-4 py-2 text-black rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <!-- Search Button -->
          <div class="flex-shrink-0">
            <button
              @click="fetchOrders"
              class="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 mt-6 sm:mt-0"
            >
              <i class="mdi mdi-magnify text-lg"></i>
              ค้นหา
            </button>
          </div>
        </div>

        <!-- Summary Row -->
        <div
          v-if="orders.length"
          class="grid sm:grid-cols-3 md:grid-cols-3 gap-6 text-white pt-4 border-t border-white/10"
        >
          <!-- Orders -->
          <div>
            <div class="text-sm text-gray-400">รวมคำสั่งซื้อ:</div>
            <div class="text-2xl font-bold flex items-center gap-2 mt-1">
              <i class="mdi mdi-cart-outline text-indigo-400"></i>
              {{ orders.length }} รายการ
            </div>
          </div>

          <!-- Total Amount -->
          <div>
            <div class="text-sm text-gray-400">
              รวมยอดขาย (เฉพาะที่จ่ายแล้ว):
            </div>
            <div
              class="text-2xl font-bold text-green-400 flex items-center gap-2 mt-1"
            >
              <i class="mdi mdi-cash-multiple text-green-400"></i>
              {{ formatPrice(totalAmount) }} บาท
            </div>
          </div>

          <!-- Commission -->
          <div>
            <div class="text-sm text-gray-400">ค่าคอมมิชชันทั้งหมด:</div>
            <div
              class="text-2xl font-bold text-yellow-400 flex items-center gap-2 mt-1"
            >
              <i class="mdi mdi-currency-usd text-yellow-400"></i>
              {{ formatPrice(totalCommission) }} บาท
            </div>
            <div class="text-xs mt-1 text-gray-400 leading-tight">
              - ค่าคอมที่นั่ง:
              {{ formatPrice(totalReferrerCommission) }} บาท<br />
              - ค่าคอมยืน: {{ formatPrice(totalStandingCommission) }} บาท
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Cards -->
    <div v-if="orders.length" class="space-y-6 max-w-6xl mx-auto px-4 py-8">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-gradient-to-br from-[#1c253b] to-[#0f1a2e] rounded-2xl shadow-2xl p-6 text-white border border-white/10"
      >
        <!-- Header using Grid แบบแนวนอนชิดซ้าย-ขวา -->
        <div class="grid sm:grid-cols-2 md:grid-cols-2 gap-4 mb-4 items-center">
          <!-- LEFT -->
          <div>
            <div class="flex items-center gap-2 text-lg font-bold">
              <i class="mdi mdi-calendar-clock text-blue-400 text-xl"></i>
              {{ formatDate(order.createdAt) }}
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <i class="mdi mdi-calendar-range-outline"></i>
              รอบแสดง: {{ formatDate(order.showDate) }}
            </div>
            <div class="flex items-center gap-2 text-sm text-white-400 mt-3">
              <i class="mdi mdi-account-outline"></i>
              สร้างออเดอร์โดย: {{ order?.user?.name }}
            </div>

            <div class="flex items-center gap-2 text-sm text-white-400 mt-3">
              <i class="mdi mdi-account-cash-outline"></i>
              รับชำระเงินโดย: {{ order?.payment?.user?.name }}
            </div>
          </div>

          <!-- RIGHT -->
          <div
            class="flex flex-col md:items-end space-y-1 text-sm sm:items-start"
          >
            <div class="flex items-center gap-1">
              <i class="mdi mdi-information-outline text-gray-400"></i>
              <span class="text-gray-400">สถานะ:</span>
              <span
                :class="[
                  'font-semibold',
                  order.status === 'PAID' ? 'text-green-400' : 'text-red-400',
                ]"
              >
                {{ order.status === "PAID" ? "ชำระแล้ว" : "ยังไม่ชำระ" }}
              </span>
            </div>
            <div class="flex items-center gap-1">
              <i class="mdi mdi-credit-card-outline text-gray-400"></i>
              <span class="text-gray-400">วิธีชำระ:</span>
              <span class="text-white font-semibold">{{ order.method }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-200"
        >
          <div class="flex items-center gap-2">
            <i class="mdi mdi-account-circle-outline text-lg text-white"></i>
            <span><strong>ลูกค้า:</strong> {{ order.customerName }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="mdi mdi-seat-outline text-lg text-white"></i>
            <span
              ><strong>ที่นั่ง Ringside:</strong> {{ order.seats.length }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <i class="mdi mdi-seat-outline text-lg text-white"></i>
            <span
              ><strong>ที่นั่ง Stadium (ผู้ใหญ่) :</strong>
              {{ order.standingAdultQty }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <i class="mdi mdi-seat-outline text-lg text-white"></i>
            <span
              ><strong>ที่นั่ง Stadium (เด็ก) :</strong>
              {{ order.standingChildQty }}</span
            >
          </div>
          <div class="flex items-center gap-2">
            <i class="mdi mdi-cash text-lg text-green-400"></i>
            <span>
              <strong>ยอดรวม (หักลบค่าคอมมิชชันแล้ว):</strong>
              {{
                formatPrice(
                  order.total -
                    ((order.referrerCommission || 0) +
                      (order.standingCommission || 0))
                )
              }}
              บาท
            </span>
          </div>
          <div class="flex items-center gap-2">
            <i class="mdi mdi-currency-usd text-lg text-yellow-400"></i>
            <span
              ><strong>ค่าคอม:</strong>
              {{
                order.referrerCommission !== 0
                  ? formatPrice(order.referrerCommission)
                  : formatPrice(order.standingCommission)
              }}
              บาท</span
            >
          </div>
        </div>

        <!-- Seat List -->
        <div class="mt-4">
          <p class="text-sm font-semibold mb-1 text-gray-300">
            <i class="mdi mdi-chair-rolling text-white mr-1"></i>
            รายการที่นั่ง:
          </p>
          <ul class="flex flex-wrap gap-2 text-sm">
            <li
              v-for="seat in order.seats"
              :key="seat.id || seat.seatNumber"
              class="bg-indigo-600/20 border border-indigo-400 rounded-md px-3 py-1"
            >
              เบอร์ {{ seat.seatNumber }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-400 text-sm pt-20">
      <i class="mdi mdi-emoticon-sad-outline text-4xl mb-2"></i>
      <p>ไม่พบข้อมูลออเดอร์ในช่วงเวลานี้</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useReferrer } from "../../../composables/useReferrer";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import type { Order } from "../../../types/Order";
import { usePageData } from "../../../stores/pageData";
const loading = usePageData();
const orders = ref<Order[]>([]);

const { getReferrerOrders, exportReferrerReport } = useReferrer();
const route = useRoute();
const referrerName = ref("");

const filters = ref({
  start: dayjs(new Date()).format("YYYY-MM-DD"),
  end: dayjs(new Date()).format("YYYY-MM-DD"),
});

const fetchOrders = async () => {
  loading.loading = true;
  try {
    const query: Record<string, string> = {};

    if (filters.value.start) {
      query.startDate = dayjs(filters.value.start).format("YYYY-MM-DD");
    }

    if (filters.value.end) {
      query.endDate = dayjs(filters.value.end).format("YYYY-MM-DD");
    }

    const referrerId = Array.isArray(route.params.id)
      ? route.params.id[0]
      : route.params.id;

    const data = await getReferrerOrders(referrerId, query);

    orders.value = data;
    const paid = data.find((o: Order) => o.status === "PAID");
    if (paid) {
      referrerName.value = paid.referrer?.name || "";
    }
  } catch (error) {
    loading.loading = false;
  } finally {
    loading.loading = false;
  }
};

const handleExport = () => {
  const referrerId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;

  const query: Record<string, string> = {};

  if (filters.value.start) {
    query.startDate = dayjs(filters.value.start).format("YYYY-MM-DD");
  }

  if (filters.value.end) {
    query.endDate = dayjs(filters.value.end).format("YYYY-MM-DD");
  }

  exportReferrerReport(referrerId, {
    startDate: query.startDate,
    endDate: query.endDate,
  });
};

onMounted(fetchOrders);

const formatDate = (d: string) => dayjs(d).format("D MMM YYYY เวลา HH:mm");
const formatPrice = (val: number | string) =>
  Number(val).toLocaleString("th-TH");

const paidOrdersOnly = computed(() =>
  orders.value.filter((o) => o.status === "PAID")
);

const totalAmount = computed(() =>
  paidOrdersOnly.value.reduce(
    (sum, o) =>
      sum +
      Number(o.total || 0) -
      Number(o.referrerCommission || 0) -
      Number(o.standingCommission || 0),
    0
  )
);

const totalReferrerCommission = computed(() =>
  paidOrdersOnly.value.reduce(
    (sum, o) => sum + Number(o.referrerCommission || 0),
    0
  )
);

const totalStandingCommission = computed(() =>
  paidOrdersOnly.value.reduce(
    (sum, o) => sum + Number(o.standingCommission || 0),
    0
  )
);

const totalCommission = computed(
  () => totalReferrerCommission.value + totalStandingCommission.value
);
</script>
