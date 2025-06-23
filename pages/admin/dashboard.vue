<template>
  <div class="grid grid-cols-12 min-h-screen bg-[#0c1a30] text-white">
    <!-- Sidebar -->
    <div
      :class="[
        collapsed ? 'col-span-2' : 'col-span-2',
        'bg-[#0a172e] px-3 py-6 transition-all duration-300',
      ]"
    >
      <SidebarItem
        v-for="item in menuItems"
        :key="item.to"
        :icon="item.icon"
        :label="item.label"
        :to="item.to"
        :collapsed="collapsed"
        :active="route.path.startsWith(item.to)"
      />
    </div>

    <!-- Content -->
    <div
      :class="[
        collapsed ? 'col-span-10' : 'col-span-10',
        'bg-[#0f1f3c] px-6 py-8 transition-all',
      ]"
    >
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-extrabold tracking-tight mb-2">Dashboard</h1>
      </div>

      <!-- Summary Cards -->
      <div
        class="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <SummaryCard
          icon="Ticket"
          label="ยอดขายรวม"
          :value="formatCurrency(pageData.totalSales)"
          sub="เดือนนี้: "
          :subValue="formatCurrency(pageData.monthSales)"
        />

        <SummaryCard
          icon="ShoppingCart"
          label="ออเดอร์"
          :value="formatCurrency(pageData.totalOrders)"
          sub="ลูกค้า: "
          :subValue="formatCurrency(pageData.totalCustomers)"
        />
        <SummaryCard
          icon="Armchair"
          label="ที่นั่งว่าง"
          :value="pageData.availableSeats"
          sub="วันนี้"
        />
        <SummaryCard
          icon="CalendarCheck"
          label="รอบวันนี้"
          :value="pageData.nextShowDate"
          sub="จองแล้ว: "
          :subValue="
            pageData.nextShowBooked + ' / ' + pageData.nextShowAvailable
          "
        />
      </div>
      <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <ChartCard title="Top Customers">
          <ul class="space-y-2 text-sm">
            <li v-for="c in pageData.topCustomers" :key="c.customer">
              {{ c.customer }} - {{ formatCurrency(c.spent) }} THB
            </li>
          </ul>
        </ChartCard>

        <ChartCard title="Top Referrers">
          <ul class="space-y-2 text-sm">
            <li v-for="r in pageData.topReferrers" :key="r.referrer">
              {{ r.name }} ({{ r.referrer }}) - คอมมิชชัน
              {{ formatCurrency(r.commission) }} / {{ r.orders }} orders
            </li>
          </ul>
        </ChartCard>
      </div>
      <!-- Charts -->
      <div
        class="grid md:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-10"
      >
        <!-- Daily Sales -->
        <ChartCard title="ยอดขายรายวัน">
          <ul class="space-y-1 text-sm">
            <li
              v-for="(sale, index) in pageData.dailySales"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ sale.date }}</span>
              <span class="font-semibold"
                >{{ formatCurrency(sale.amount) }} THB</span
              >
            </li>
          </ul>
        </ChartCard>

        <!-- Sales by Method -->
        <ChartCard title="ช่องทางชำระเงิน">
          <ul class="space-y-1 text-sm">
            <li
              v-for="(method, index) in pageData.salesByMethod"
              :key="index"
              class="flex justify-between"
            >
              <span>{{ method.method }}</span>
              <span class="font-semibold"
                >{{ formatCurrency(method.total) }} THB</span
              >
            </li>
          </ul>
        </ChartCard>
      </div>

      <!-- Top Lists -->

      <!-- Sales by Zone -->
      <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <ChartCard title="สถานะคำสั่งซื้อ">
          <ul class="space-y-2 text-sm">
            <li
              v-for="[status, count] in Object.entries(
                pageData.orderStatusCounts
              )"
              :key="status"
              class="flex justify-between"
            >
              <span>{{ status }}</span>
              <span class="font-semibold">{{ formatCurrency(count) }}</span>
            </li>
          </ul>
        </ChartCard>
        <ChartCard title="ยอดขายตามโซน">
          <div class="space-y-2">
            <div
              v-for="z in pageData.salesByZone"
              :key="z.zone"
              class="flex items-center gap-4"
            >
              <span class="w-32 capitalize text-sm">{{ z.zone }}</span>
              <div class="flex-1 bg-gray-700 rounded-full h-3">
                <div
                  class="bg-blue-500 h-3 rounded-full"
                  :style="{ width: (z.total / maxZoneTotal) * 100 + '%' }"
                ></div>
              </div>
              <span class="text-sm">{{ formatCurrency(z.total) }} THB</span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  Ticket,
  ShoppingCart,
  Armchair,
  CheckCircle,
  XCircle,
  CalendarCheck,
} from "lucide-vue-next";

import SummaryCard from "@/components/dashboard/SummaryCard.vue";
import ChartCard from "@/components/dashboard/ChartCard.vue";
import BarChart from "@/components/charts/BarChart.vue";
import PieChart from "@/components/charts/PieChart.vue";
import SidebarItem from "@/components/SidebarItem.vue";
import { formatCurrency } from "@/utils/formatCurrency";
const { t } = useI18n();
const route = useRoute();
const collapsed = ref(false);
const menuItems = useAdminMenu();
const { getDashbord } = useDashbord();
const pageData = usePageData();
// const pageData = reactive({
//   totalSales: "0",
//   monthSales: "0 บาท",
//   totalOrders: 0,
//   totalCustomers: 0,
//   availableSeats: 0,
//   dailySales: [],
//   alerts: [],
//   nextShowDate: "",
//   nextShowAvailable: 0,
//   nextShowBooked: 0,
//   salesByZone: [],
//   salesByMethod: [],
//   topCustomers: [],
//   topReferrers: [],
//   orderStatusCounts: {},
// });

const maxAmount = computed(() =>
  Math.max(...pageData.dailySales.map((bar) => bar.amount || 0))
);

const maxZoneTotal = computed(() =>
  Math.max(...pageData.salesByZone.map((z) => z.total || 0))
);

const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

onMounted(async () => {
  pageData.loading = true;
  handleResize();
  window.addEventListener("resize", handleResize);
  try {
    const data = await getDashbord();
    Object.assign(pageData, data);
  } catch (error) {
    console.error("❌ Dashboard fetch error:", error);
  } finally {
    pageData.loading = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
