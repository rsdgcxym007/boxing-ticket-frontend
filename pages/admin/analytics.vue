<template>
  <div class="analytics-dashboard min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        📊 Analytics Dashboard
      </h1>
      <p class="text-gray-600">ภาพรวมข้อมูลธุรกิจและการวิเคราะห์แบบเรียลไทม์</p>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <AnalyticsStatsCard
        v-for="stat in quickStats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :trend="stat.trend"
        :icon="stat.icon"
        :color="stat.color"
      />
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Sales Chart -->
      <div class="lg:col-span-2">
        <AnalyticsSalesChart
          :daily-data="dailySales"
          :loading="loadingSales"
          @date-change="handleDateChange"
        />
      </div>

      <!-- Realtime Metrics -->
      <div class="space-y-6">
        <AnalyticsRealtimeHealth
          :health-data="systemHealth"
          :loading="loadingHealth"
        />
        <AnalyticsBusinessMetrics
          :metrics="businessMetrics"
          :loading="loadingMetrics"
        />
      </div>
    </div>

    <!-- Second Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Seat Utilization -->
      <AnalyticsSeatUtilization
        :utilization-data="seatUtilization"
        :loading="loadingUtilization"
      />

      <!-- Predictions -->
      <AnalyticsPredictions
        :predictions="salesPredictions"
        :loading="loadingPredictions"
      />
    </div>

    <!-- Performance Metrics -->
    <AnalyticsPerformanceMetrics
      :performance-data="performanceMetrics"
      :loading="loadingPerformance"
      class="mb-8"
    />

    <!-- AI Recommendations Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        🤖 AI Recommendations
      </h2>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsAIRecommendations
          :recommendations="aiRecommendations"
          :loading="loadingAI"
        />
        <AnalyticsOptimizationSuggestions
          :suggestions="optimizationSuggestions"
          :loading="loadingOptimization"
        />
      </div>
    </div>

    <!-- Export & Actions -->
    <div class="flex flex-wrap gap-4 justify-end">
      <button
        @click="exportData"
        :disabled="exporting"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" />
        {{ exporting ? "กำลังส่งออก..." : "ส่งออกข้อมูล" }}
      </button>

      <button
        @click="refreshAllData"
        :disabled="refreshing"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
        {{ refreshing ? "กำลังรีเฟรช..." : "รีเฟรชข้อมูล" }}
      </button>
    </div>

    <!-- Realtime Connection Status -->
    <AnalyticsConnectionStatus
      :connection-status="realtimeConnection"
      class="fixed bottom-4 right-4"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAnalytics } from "@/composables/useAnalytics";
import { useAI } from "@/composables/useAI";
import { useRealtime } from "@/composables/useRealtime";
import { useSingleToast } from "@/composables/useSingleToast";

// Meta
definePageMeta({
  middleware: ["auth", "admin-only"],
  layout: "admin",
});

// Composables
const analytics = useAnalytics();
const ai = useAI();
const realtime = useRealtime();
const { showToast } = useSingleToast();

// Reactive state
const dailySales = ref(null);
const systemHealth = ref(null);
const businessMetrics = ref(null);
const seatUtilization = ref([]);
const salesPredictions = ref(null);
const performanceMetrics = ref(null);
const aiRecommendations = ref([]);
const optimizationSuggestions = ref([]);

// Loading states
const loadingSales = ref(false);
const loadingHealth = ref(false);
const loadingMetrics = ref(false);
const loadingUtilization = ref(false);
const loadingPredictions = ref(false);
const loadingPerformance = ref(false);
const loadingAI = ref(false);
const loadingOptimization = ref(false);
const refreshing = ref(false);
const exporting = ref(false);

// Quick stats computed
const quickStats = computed(() => [
  {
    title: "ยอดขายวันนี้",
    value: businessMetrics.value?.currentSales || 0,
    change: "+12.5%",
    trend: "up",
    icon: "heroicons:currency-dollar",
    color: "green",
  },
  {
    title: "ผู้ใช้ออนไลน์",
    value: businessMetrics.value?.onlineUsers || 0,
    change: "+8.2%",
    trend: "up",
    icon: "heroicons:users",
    color: "blue",
  },
  {
    title: "ออเดอร์วันนี้",
    value: businessMetrics.value?.todayOrders || 0,
    change: "+15.1%",
    trend: "up",
    icon: "heroicons:shopping-cart",
    color: "purple",
  },
  {
    title: "อัตราการแปลง",
    value: `${businessMetrics.value?.conversionRate || 0}%`,
    change: "-2.1%",
    trend: "down",
    icon: "heroicons:chart-bar",
    color: "orange",
  },
]);

const realtimeConnection = computed(() => ({
  connected: realtime.connectionStatus.value.connected,
  reconnecting: realtime.connectionStatus.value.reconnecting,
}));

/**
 * Load all analytics data
 */
const loadAllData = async () => {
  await Promise.all([
    loadDailySales(),
    loadSystemHealth(),
    loadBusinessMetrics(),
    loadSeatUtilization(),
    loadSalesPredictions(),
    loadPerformanceMetrics(),
    loadAIRecommendations(),
  ]);
};

const loadDailySales = async () => {
  loadingSales.value = true;
  try {
    dailySales.value = await analytics.getDailySales();
  } catch (error) {
    console.error("Failed to load daily sales:", error);
  } finally {
    loadingSales.value = false;
  }
};

const loadSystemHealth = async () => {
  loadingHealth.value = true;
  try {
    systemHealth.value = await analytics.getSystemHealth();
  } catch (error) {
    console.error("Failed to load system health:", error);
  } finally {
    loadingHealth.value = false;
  }
};

const loadBusinessMetrics = async () => {
  loadingMetrics.value = true;
  try {
    businessMetrics.value = await analytics.getBusinessMetrics();
  } catch (error) {
    console.error("Failed to load business metrics:", error);
  } finally {
    loadingMetrics.value = false;
  }
};

const loadSeatUtilization = async () => {
  loadingUtilization.value = true;
  try {
    seatUtilization.value = await analytics.getSeatUtilization();
  } catch (error) {
    console.error("Failed to load seat utilization:", error);
  } finally {
    loadingUtilization.value = false;
  }
};

const loadSalesPredictions = async () => {
  loadingPredictions.value = true;
  try {
    salesPredictions.value = await analytics.getSalesPredictions(30);
  } catch (error) {
    console.error("Failed to load sales predictions:", error);
  } finally {
    loadingPredictions.value = false;
  }
};

const loadPerformanceMetrics = async () => {
  loadingPerformance.value = true;
  try {
    performanceMetrics.value = await analytics.getPerformanceMetrics();
  } catch (error) {
    console.error("Failed to load performance metrics:", error);
  } finally {
    loadingPerformance.value = false;
  }
};

const loadAIRecommendations = async () => {
  loadingAI.value = true;
  loadingOptimization.value = true;
  try {
    // Load AI recommendations for different zones
    const zones = ["VIP", "Premium", "Standard"];
    const recommendations = await Promise.all(
      zones.map((zone) => ai.getRevenueOptimizationSuggestions(zone))
    );
    aiRecommendations.value = recommendations.flat();
    optimizationSuggestions.value = recommendations.flat();
  } catch (error) {
    console.error("Failed to load AI recommendations:", error);
  } finally {
    loadingAI.value = false;
    loadingOptimization.value = false;
  }
};

/**
 * Event handlers
 */
const handleDateChange = async (newDate: string) => {
  loadingSales.value = true;
  try {
    dailySales.value = await analytics.getDailySales(newDate);
  } catch (error) {
    showToast("error", "ไม่สามารถโหลดข้อมูลวันที่ใหม่ได้");
  } finally {
    loadingSales.value = false;
  }
};

const refreshAllData = async () => {
  refreshing.value = true;
  try {
    await loadAllData();
    showToast("success", "รีเฟรชข้อมูลเรียบร้อยแล้ว");
  } catch (error) {
    showToast("error", "ไม่สามารถรีเฟรชข้อมูลได้");
  } finally {
    refreshing.value = false;
  }
};

const exportData = async () => {
  exporting.value = true;
  try {
    // Combine all data for export
    const exportData = {
      timestamp: new Date().toISOString(),
      dailySales: dailySales.value,
      systemHealth: systemHealth.value,
      businessMetrics: businessMetrics.value,
      seatUtilization: seatUtilization.value,
      salesPredictions: salesPredictions.value,
      performanceMetrics: performanceMetrics.value,
    };

    // Create and download file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("success", "ส่งออกข้อมูลเรียบร้อยแล้ว");
  } catch (error) {
    showToast("error", "ไม่สามารถส่งออกข้อมูลได้");
  } finally {
    exporting.value = false;
  }
};

/**
 * Setup realtime updates
 */
const setupRealtimeUpdates = () => {
  // Connect to realtime system
  realtime.connect();
  realtime.subscribeToAnalytics();

  // Listen for analytics updates
  window.addEventListener("analytics-update", (event: any) => {
    const { type, data } = event.detail;

    switch (type) {
      case "business-metrics":
        businessMetrics.value = { ...businessMetrics.value, ...data };
        break;
      case "system-health":
        systemHealth.value = { ...systemHealth.value, ...data };
        break;
      case "sales-update":
        if (dailySales.value) {
          dailySales.value.totalSales += data.amount;
          dailySales.value.totalOrders += 1;
        }
        break;
    }
  });
};

/**
 * Auto-refresh interval
 */
let refreshInterval: NodeJS.Timeout;

onMounted(async () => {
  await loadAllData();
  setupRealtimeUpdates();

  // Auto-refresh every 5 minutes
  refreshInterval = setInterval(() => {
    loadBusinessMetrics();
    loadSystemHealth();
  }, 5 * 60 * 1000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
  realtime.unsubscribeFromAnalytics();
  realtime.disconnect();
});
</script>

<style scoped>
.analytics-dashboard {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}
</style>
