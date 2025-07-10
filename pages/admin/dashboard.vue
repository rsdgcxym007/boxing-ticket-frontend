<template>
  <div
    class="min-h-screen bg-gradient-to-br from-[#0f1f3c] via-[#1a2b4d] to-[#0f1f3c] text-white px-4 py-6"
  >
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-3xl md:text-4xl font-bold tracking-tight mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Dashboard Analytics
          </h1>
          <p class="text-gray-400 text-sm md:text-base">
            อัปเดตล่าสุด: {{ formatDateTime(pageData.lastUpdated) }}
          </p>
        </div>
        <div
          class="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20"
        >
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-green-400">{{
            pageData.systemHealth?.systemStatus || "ปกติ"
          }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Stats Overview -->
    <div
      class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
    >
      <div
        class="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <ShoppingCart class="w-5 h-5 text-blue-400" />
          <span class="text-xs text-gray-400">วันนี้</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.quickStats?.todayOrders || 0 }}
        </div>
        <div class="text-xs text-gray-400">ออเดอร์</div>
      </div>

      <div
        class="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <CheckCircle class="w-5 h-5 text-green-400" />
          <span class="text-xs text-gray-400">ชำระแล้ว</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.quickStats?.todayPaidOrders || 0 }}
        </div>
        <div class="text-xs text-gray-400">ออเดอร์</div>
      </div>

      <div
        class="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 p-4 rounded-xl border border-yellow-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <XCircle class="w-5 h-5 text-yellow-400" />
          <span class="text-xs text-gray-400">รอชำระ</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.quickStats?.pendingOrders || 0 }}
        </div>
        <div class="text-xs text-gray-400">ออเดอร์</div>
      </div>

      <div
        class="bg-gradient-to-br from-red-500/10 to-red-600/10 p-4 rounded-xl border border-red-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <XCircle class="w-5 h-5 text-red-400" />
          <span class="text-xs text-gray-400">หมดอายุ</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.quickStats?.expiredOrders || 0 }}
        </div>
        <div class="text-xs text-gray-400">ออเดอร์</div>
      </div>

      <div
        class="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 rounded-xl border border-purple-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <Armchair class="w-5 h-5 text-purple-400" />
          <span class="text-xs text-gray-400">ที่นั่งว่าง</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.seatAvailability?.summary?.totalAvailable || 0 }}
        </div>
        <div class="text-xs text-gray-400">ที่นั่ง</div>
      </div>

      <!-- <div
        class="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 p-4 rounded-xl border border-emerald-500/20"
      >
        <div class="flex items-center gap-2 mb-2">
          <Ticket class="w-5 h-5 text-emerald-400" />
          <span class="text-xs text-gray-400">Success Rate</span>
        </div>
        <div class="text-xl font-bold">
          {{ pageData.quickStats?.successRate || 0 }}%
        </div>
        <div class="text-xs text-gray-400">อัตราสำเร็จ</div>
      </div> -->
    </div>

    <!-- Revenue Overview -->
    <div
      class="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-8"
    >
      <div
        class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
      >
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div
            class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"
          >
            <span class="text-green-400 font-bold">฿</span>
          </div>
          รายได้วันนี้
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-400">รายได้รวม</span>
            <span class="font-bold text-green-400">{{
              formatCurrency(pageData.revenue?.today?.grossRevenue || 0)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">คอมมิชชัน</span>
            <span class="font-bold text-red-400"
              >-{{
                formatCurrency(pageData.revenue?.today?.totalCommission || 0)
              }}</span
            >
          </div>
          <div class="flex justify-between border-t border-gray-700 pt-2">
            <span class="text-gray-400">รายได้สุทธิ</span>
            <span class="font-bold text-xl text-white">{{
              formatCurrency(pageData.revenue?.today?.netRevenue || 0)
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
      >
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div
            class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center"
          >
            <span class="text-blue-400 font-bold">฿</span>
          </div>
          รายได้เดือนนี้
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-400">รายได้รวม</span>
            <span class="font-bold text-green-400">{{
              formatCurrency(pageData.revenue?.thisMonth?.grossRevenue || 0)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">คอมมิชชัน</span>
            <span class="font-bold text-red-400"
              >-{{
                formatCurrency(
                  pageData.revenue?.thisMonth?.totalCommission || 0
                )
              }}</span
            >
          </div>
          <div class="flex justify-between border-t border-gray-700 pt-2">
            <span class="text-gray-400">รายได้สุทธิ</span>
            <span class="font-bold text-xl text-white">{{
              formatCurrency(pageData.revenue?.thisMonth?.netRevenue || 0)
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
      >
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <div
            class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center"
          >
            <span class="text-purple-400 font-bold">฿</span>
          </div>
          รายได้ทั้งหมด
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-400">รายได้รวม</span>
            <span class="font-bold text-green-400">{{
              formatCurrency(pageData.revenue?.allTime?.grossRevenue || 0)
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">คอมมิชชัน</span>
            <span class="font-bold text-red-400"
              >-{{
                formatCurrency(pageData.revenue?.allTime?.totalCommission || 0)
              }}</span
            >
          </div>
          <div class="flex justify-between border-t border-gray-700 pt-2">
            <span class="text-gray-400">รายได้สุทธิ</span>
            <span class="font-bold text-xl text-white">{{
              formatCurrency(pageData.revenue?.allTime?.netRevenue || 0)
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Sales and Seat Availability -->
    <div class="grid grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
      <!-- Ticket Sales -->
      <div
        class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
      >
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Ticket class="w-5 h-5 text-blue-400" />
          ยอดขายตั๋ว
        </h3>
        <div class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-xs text-gray-400 mb-1">วันนี้</div>
            <div class="text-xl font-bold">
              {{ pageData.ticketSales?.today?.paidTickets || 0 }}
            </div>
            <div class="text-xs text-gray-400">ตั๋ว</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-gray-400 mb-1">สัปดาห์นี้</div>
            <div class="text-xl font-bold">
              {{ pageData.ticketSales?.thisWeek?.paidTickets || 0 }}
            </div>
            <div class="text-xs text-gray-400">ตั๋ว</div>
          </div>
          <div class="text-center">
            <div class="text-xs text-gray-400 mb-1">เดือนนี้</div>
            <div class="text-xl font-bold">
              {{ pageData.ticketSales?.thisMonth?.paidTickets || 0 }}
            </div>
            <div class="text-xs text-gray-400">ตั๋ว</div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Ringside</span>
            <span class="font-semibold"
              >{{
                pageData.ticketSales?.today?.ringsideTickets || 0
              }}
              ตั๋ว</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Stadium</span>
            <span class="font-semibold"
              >{{ pageData.ticketSales?.today?.stadiumTickets || 0 }} ตั๋ว</span
            >
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">Standing</span>
            <span class="font-semibold"
              >{{
                pageData.ticketSales?.today?.standingTickets || 0
              }}
              ตั๋ว</span
            >
          </div>
        </div>
      </div>

      <!-- Seat Availability -->
      <div
        class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
      >
        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <Armchair class="w-5 h-5 text-blue-400" />
          ที่นั่งตามโซน
        </h3>
        <div class="space-y-3">
          <div
            v-for="zone in pageData.seatAvailability?.zones"
            :key="zone.zoneId"
            class="flex items-center gap-3"
          >
            <div
              class="w-3 h-3 rounded-full"
              :class="
                zone.occupancyRate === 0
                  ? 'bg-green-500'
                  : zone.occupancyRate < 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              "
            ></div>
            <span class="text-sm capitalize flex-1">{{
              zone.zoneName.replace(/-/g, " ")
            }}</span>
            <span class="text-xs text-gray-400"
              >{{ zone.availableSeats }}/{{ zone.totalSeats }}</span
            >
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-700">
          <div class="flex justify-between">
            <span class="text-gray-400">ที่นั่งทั้งหมด</span>
            <span class="font-bold">{{
              pageData.seatAvailability?.summary?.totalSeats || 0
            }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">ที่นั่งว่าง</span>
            <span class="font-bold text-green-400">{{
              pageData.seatAvailability?.summary?.totalAvailable || 0
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Referrers -->
    <div
      class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20 mb-8"
    >
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <div
          class="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center"
        >
          <span class="text-orange-400 font-bold">🤝</span>
        </div>
        ผู้แนะนำวันนี้
      </h3>
      <div class="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4">
        <div
          v-for="referrer in pageData.todayReferrers?.referrers"
          :key="referrer.id"
          class="bg-[#0f1f3c] p-4 rounded-lg border border-blue-700/30"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-semibold text-white">{{ referrer.name }}</div>
              <div class="text-xs text-gray-400">{{ referrer.code }}</div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-green-400">
                {{ formatCurrency(referrer.totalCommission) }}
              </div>
              <div class="text-xs text-gray-400">คอมมิชชัน</div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-400">ออเดอร์:</span>
              <span class="font-semibold ml-1">{{ referrer.totalOrders }}</span>
            </div>
            <div>
              <span class="text-gray-400">ยอดขาย:</span>
              <span class="font-semibold ml-1">{{
                formatCurrency(referrer.totalAmount)
              }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-700">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-xl font-bold text-white">
              {{ pageData.todayReferrers?.summary?.totalReferrers || 0 }}
            </div>
            <div class="text-xs text-gray-400">ผู้แนะนำ</div>
          </div>
          <div>
            <div class="text-xl font-bold text-white">
              {{ pageData.todayReferrers?.summary?.totalOrders || 0 }}
            </div>
            <div class="text-xs text-gray-400">ออเดอร์</div>
          </div>
          <div>
            <div class="text-xl font-bold text-green-400">
              {{
                formatCurrency(
                  pageData.todayReferrers?.summary?.totalAmount || 0
                )
              }}
            </div>
            <div class="text-xs text-gray-400">ยอดขาย</div>
          </div>
          <div>
            <div class="text-xl font-bold text-orange-400">
              {{
                formatCurrency(
                  pageData.todayReferrers?.summary?.totalCommission || 0
                )
              }}
            </div>
            <div class="text-xs text-gray-400">คอมมิชชัน</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Stats -->
    <div
      class="bg-gradient-to-br from-[#1a2b4d] to-[#0f1f3c] p-6 rounded-xl border border-blue-500/20"
    >
      <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <div
          class="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center"
        >
          <span class="text-cyan-400 font-bold">👥</span>
        </div>
        ข้อมูลลูกค้า
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-white">
            {{ pageData.customers?.summary?.totalCustomers || 0 }}
          </div>
          <div class="text-xs text-gray-400">ลูกค้าทั้งหมด</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-400">
            {{ pageData.customers?.today?.newCustomers || 0 }}
          </div>
          <div class="text-xs text-gray-400">ลูกค้าใหม่วันนี้</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-400">
            {{ pageData.customers?.summary?.repeatCustomers || 0 }}
          </div>
          <div class="text-xs text-gray-400">ลูกค้าประจำ</div>
        </div>
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

import { formatCurrency } from "@/utils/formatCurrency";

// 🎯 การใช้งาน Composables
const { t } = useI18n();
const collapsed = ref(false);

// 📊 Dashboard API - ใช้ฟังก์ชันใหม่ที่อัปเดตแล้ว
const {
  getDashboard, // ข้อมูลแดชบอร์ดหลัก
  getDashboardStats, // สถิติโดยรวม
  getRevenueAnalytics, // วิเคราะห์รายได้
  getSeatOccupancy, // ข้อมูลการใช้งานที่นั่ง
  getRecentActivities, // กิจกรรมล่าสุด
  getSystemAlerts, // แจ้งเตือนระบบ
} = useDashboard();

const pageData = usePageData();

// � ฟังก์ชันจัดรูปแบบวันที่และเวลา
const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 📱 จัดการ Responsive Design
const handleResize = () => {
  collapsed.value = window.innerWidth < 768;
};

onMounted(async () => {
  // 🔄 เริ่มต้นการโหลดข้อมูล
  pageData.loading = true;
  handleResize();
  window.addEventListener("resize", handleResize);

  try {
    // 📊 ดึงข้อมูลแดชบอร์ดหลักจาก API ใหม่
    console.log("🚀 กำลังโหลดข้อมูลแดชบอร์ด...");
    const data = await getDashboard();

    // 📋 อัปเดตข้อมูลทั้งหมด
    Object.assign(pageData, data);
    console.log("✅ โหลดข้อมูลแดชบอร์ดสำเร็จ");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการโหลดข้อมูลแดชบอร์ด:", error);

    // 🚨 แสดงข้อความแจ้งเตือนให้ผู้ใช้ทราบ
    // toast.error("ไม่สามารถโหลดข้อมูลแดชบอร์ดได้ กรุณาลองใหม่อีกครั้ง");
  } finally {
    // ⏹️ หยุดการแสดงสถานะโหลด
    pageData.loading = false;
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
