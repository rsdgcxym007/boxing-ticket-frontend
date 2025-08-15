<template>
  <div class="statistics-arena muay-thai-page">
    <!-- Combat Background -->
    <div class="arena-background">
      <div class="statistical-lights"></div>
      <div class="chart-patterns"></div>
      <div class="data-streams"></div>
    </div>

    <!-- Statistics Content -->
    <div class="stats-content">
      <!-- Page Header -->
      <header class="stats-header">
        <button class="back-btn combat-btn" @click="goBack">
          <Icon icon="mdi:arrow-left" class="back-icon" />
        </button>

        <div class="header-title">
          <h1 class="page-title combat-text">📊 BATTLE STATISTICS 📊</h1>
          <p class="page-subtitle">ARENA PERFORMANCE DATA</p>
        </div>

        <button
          class="refresh-btn combat-btn"
          @click="refreshData"
          :disabled="isLoading"
        >
          <Icon
            icon="mdi:refresh"
            class="refresh-icon"
            :class="{ spinning: isLoading }"
          />
        </button>
      </header>

      <!-- Quick Stats Cards -->
      <section class="quick-stats-section">
        <div class="stats-grid">
          <!-- Total Scans -->
          <div class="stat-card primary-stat">
            <div class="stat-icon-wrapper">
              <Icon icon="mdi:qrcode-scan" class="stat-icon" />
              <div class="stat-glow"></div>
            </div>
            <div class="stat-details">
              <h3 class="stat-value combat-text">
                {{ formatNumber(stats.totalScans) }}
              </h3>
              <p class="stat-label">Total Scans</p>
              <div
                class="stat-trend positive"
                v-if="trends.totalScansChange > 0"
              >
                <Icon icon="mdi:trending-up" class="trend-icon" />
                <span>+{{ trends.totalScansChange }}%</span>
              </div>
            </div>
          </div>

          <!-- Success Rate -->
          <div class="stat-card success-stat">
            <div class="stat-icon-wrapper">
              <Icon icon="mdi:check-circle" class="stat-icon" />
              <div class="stat-glow"></div>
            </div>
            <div class="stat-details">
              <h3 class="stat-value combat-text">{{ stats.successRate }}%</h3>
              <p class="stat-label">Success Rate</p>
              <div
                class="stat-trend"
                :class="{
                  positive: trends.successRateChange > 0,
                  negative: trends.successRateChange < 0,
                }"
              >
                <Icon
                  :icon="
                    trends.successRateChange > 0
                      ? 'mdi:trending-up'
                      : 'mdi:trending-down'
                  "
                  class="trend-icon"
                />
                <span
                  >{{ trends.successRateChange > 0 ? "+" : ""
                  }}{{ trends.successRateChange }}%</span
                >
              </div>
            </div>
          </div>

          <!-- Today's Battles -->
          <div class="stat-card today-stat">
            <div class="stat-icon-wrapper">
              <Icon icon="mdi:calendar-today" class="stat-icon" />
              <div class="stat-glow"></div>
            </div>
            <div class="stat-details">
              <h3 class="stat-value combat-text">
                {{ formatNumber(stats.todayScans) }}
              </h3>
              <p class="stat-label">Today's Scans</p>
              <div class="stat-trend positive" v-if="stats.todayScans > 0">
                <Icon icon="mdi:fire" class="trend-icon" />
                <span>Active</span>
              </div>
            </div>
          </div>

          <!-- Unique Fighters -->
          <div class="stat-card fighters-stat">
            <div class="stat-icon-wrapper">
              <Icon icon="mdi:account-group" class="stat-icon" />
              <div class="stat-glow"></div>
            </div>
            <div class="stat-details">
              <h3 class="stat-value combat-text">
                {{ formatNumber(stats.uniqueOrders) }}
              </h3>
              <p class="stat-label">Unique Orders</p>
              <div
                class="stat-trend positive"
                v-if="trends.uniqueOrdersChange > 0"
              >
                <Icon icon="mdi:account-plus" class="trend-icon" />
                <span>+{{ trends.uniqueOrdersChange }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <!-- Scan Activity Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <Icon icon="mdi:chart-line" class="chart-icon" />
              <h3 class="chart-title combat-text">SCAN ACTIVITY</h3>
            </div>
            <div class="chart-controls">
              <button
                v-for="period in timePeriods"
                :key="period.value"
                class="period-btn"
                :class="{ active: selectedPeriod === period.value }"
                @click="selectPeriod(period.value)"
              >
                {{ period.label }}
              </button>
            </div>
          </div>

          <div class="chart-container">
            <canvas ref="scanChart" class="activity-chart"></canvas>
          </div>
        </div>

        <!-- Success vs Failure Pie Chart -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title-wrapper">
              <Icon icon="mdi:chart-donut" class="chart-icon" />
              <h3 class="chart-title combat-text">SUCCESS RATIO</h3>
            </div>
          </div>

          <div class="chart-container pie-chart-container">
            <canvas ref="successChart" class="success-chart"></canvas>
            <div class="pie-center-stats">
              <div class="center-value combat-text">
                {{ stats.successRate }}%
              </div>
              <div class="center-label">Overall Success</div>
            </div>
          </div>

          <div class="chart-legend">
            <div class="legend-item success">
              <div class="legend-color"></div>
              <span>Successful ({{ stats.successfulScans }})</span>
            </div>
            <div class="legend-item failure">
              <div class="legend-color"></div>
              <span>Failed ({{ stats.failedScans }})</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Detailed Analytics -->
      <section class="analytics-section">
        <h2 class="section-title combat-text">
          <Icon icon="mdi:analytics" class="section-icon" />
          DETAILED ANALYTICS
        </h2>

        <div class="analytics-grid">
          <!-- Peak Hours -->
          <div class="analytics-card">
            <div class="analytics-header">
              <Icon icon="mdi:clock-outline" class="analytics-icon" />
              <h3 class="analytics-title combat-text">PEAK HOURS</h3>
            </div>
            <div class="peak-hours">
              <div v-for="hour in peakHours" :key="hour.time" class="hour-bar">
                <div class="hour-label">{{ hour.time }}</div>
                <div class="hour-progress">
                  <div
                    class="hour-fill"
                    :style="{
                      width: `${
                        (hour.scans /
                          Math.max(...peakHours.map((h) => h.scans))) *
                        100
                      }%`,
                    }"
                  ></div>
                </div>
                <div class="hour-count">{{ hour.scans }}</div>
              </div>
            </div>
          </div>

          <!-- Recent Performance -->
          <div class="analytics-card">
            <div class="analytics-header">
              <Icon icon="mdi:speedometer" class="analytics-icon" />
              <h3 class="analytics-title combat-text">PERFORMANCE</h3>
            </div>
            <div class="performance-metrics">
              <div class="metric-item">
                <div class="metric-label">Avg. Scan Time</div>
                <div class="metric-value combat-text">{{ avgScanTime }}s</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Fastest Scan</div>
                <div class="metric-value combat-text">{{ fastestScan }}s</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Error Rate</div>
                <div class="metric-value combat-text">{{ errorRate }}%</div>
              </div>
              <div class="metric-item">
                <div class="metric-label">Uptime</div>
                <div class="metric-value combat-text">{{ uptime }}%</div>
              </div>
            </div>
          </div>

          <!-- Top Scan Locations -->
          <div class="analytics-card">
            <div class="analytics-header">
              <Icon icon="mdi:map-marker" class="analytics-icon" />
              <h3 class="analytics-title combat-text">TOP LOCATIONS</h3>
            </div>
            <div class="locations-list">
              <div
                v-for="location in topLocations"
                :key="location.name"
                class="location-item"
              >
                <Icon icon="mdi:map-marker" class="location-icon" />
                <div class="location-details">
                  <div class="location-name">{{ location.name }}</div>
                  <div class="location-stats">{{ location.scans }} scans</div>
                </div>
                <div class="location-percentage">
                  {{ location.percentage }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Export & Actions -->
      <section class="actions-section">
        <div class="action-buttons">
          <button class="action-btn export-btn combat-btn" @click="exportData">
            <Icon icon="mdi:download" class="btn-icon" />
            <span class="combat-text">EXPORT DATA</span>
          </button>

          <button
            class="action-btn clear-btn combat-btn"
            @click="confirmClearData"
          >
            <Icon icon="mdi:delete-sweep" class="btn-icon" />
            <span class="combat-text">CLEAR HISTORY</span>
          </button>

          <button
            class="action-btn sync-btn combat-btn"
            @click="syncData"
            :disabled="isSyncing"
          >
            <Icon
              icon="mdi:sync"
              class="btn-icon"
              :class="{ spinning: isSyncing }"
            />
            <span class="combat-text">SYNC DATA</span>
          </button>
        </div>
      </section>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation activeTab="stats" />

    <!-- Modals -->
    <ConfirmModal
      v-if="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="handleConfirm"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";
import { useQRScannerStore } from "@/stores/qrScanner";
import { useRouter } from "vue-router";
import BottomNavigation from "@/components/Mobile/BottomNavigation.vue";
import ConfirmModal from "@/components/Mobile/ConfirmModal.vue";

// Composables
const qrStore = useQRScannerStore();
const router = useRouter();

// Refs
const scanChart = ref(null);
const successChart = ref(null);

// State
const isLoading = ref(false);
const isSyncing = ref(false);
const selectedPeriod = ref("7d");
const showConfirmModal = ref(false);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref(null);

// Chart instances
let scanChartInstance = null;
let successChartInstance = null;

// Data
const timePeriods = [
  { label: "24H", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "30D", value: "30d" },
  { label: "ALL", value: "all" },
];

// Computed
const stats = computed(() => qrStore.stats);

const trends = computed(() => {
  // Mock trend data - in real app, calculate from historical data
  return {
    totalScansChange: 12,
    successRateChange: 5,
    uniqueOrdersChange: 8,
  };
});

const peakHours = computed(() => {
  // Mock peak hours data
  return [
    { time: "18:00", scans: 45 },
    { time: "19:00", scans: 62 },
    { time: "20:00", scans: 78 },
    { time: "21:00", scans: 34 },
    { time: "22:00", scans: 23 },
  ];
});

const topLocations = computed(() => {
  // Mock location data
  return [
    { name: "Main Gate", scans: 156, percentage: 45 },
    { name: "VIP Entrance", scans: 89, percentage: 26 },
    { name: "Side Gate", scans: 67, percentage: 19 },
    { name: "Staff Entrance", scans: 34, percentage: 10 },
  ];
});

const avgScanTime = computed(() => "1.2");
const fastestScan = computed(() => "0.8");
const errorRate = computed(() =>
  (
    (stats.value.failedScans / Math.max(stats.value.totalScans, 1)) *
    100
  ).toFixed(1)
);
const uptime = computed(() => "99.2");

// Methods
const goBack = () => {
  router.back();
};

const refreshData = async () => {
  isLoading.value = true;
  try {
    await qrStore.fetchRemoteStats();
    await updateCharts();
  } catch (error) {
    console.error("Failed to refresh data:", error);
  } finally {
    isLoading.value = false;
  }
};

const selectPeriod = (period) => {
  selectedPeriod.value = period;
  updateCharts();
};

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const initializeCharts = async () => {
  await nextTick();

  try {
    // Dynamic import Chart.js to avoid SSR issues
    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);

    // Initialize scan activity chart
    if (scanChart.value) {
      const ctx = scanChart.value.getContext("2d");

      scanChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Successful Scans",
              data: [12, 19, 15, 25, 22, 30, 28],
              borderColor: "#22c55e",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: "Failed Scans",
              data: [2, 3, 1, 4, 2, 3, 2],
              borderColor: "#e10600",
              backgroundColor: "rgba(225, 6, 0, 0.1)",
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: "#f5f5f5",
                font: {
                  weight: "bold",
                },
              },
            },
          },
          scales: {
            x: {
              ticks: { color: "#b0b0b0" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
            y: {
              ticks: { color: "#b0b0b0" },
              grid: { color: "rgba(255, 255, 255, 0.1)" },
            },
          },
        },
      });
    }

    // Initialize success pie chart
    if (successChart.value) {
      const ctx = successChart.value.getContext("2d");

      successChartInstance = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Successful", "Failed"],
          datasets: [
            {
              data: [stats.value.successfulScans, stats.value.failedScans],
              backgroundColor: ["#22c55e", "#e10600"],
              borderColor: ["#16a34a", "#b91c1c"],
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "70%",
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  } catch (error) {
    console.error("Failed to initialize charts:", error);
  }
};

const updateCharts = () => {
  // Update chart data based on selected period
  // This would fetch real data in a production app
  if (scanChartInstance) {
    scanChartInstance.update();
  }
  if (successChartInstance) {
    successChartInstance.data.datasets[0].data = [
      stats.value.successfulScans,
      stats.value.failedScans,
    ];
    successChartInstance.update();
  }
};

const exportData = () => {
  try {
    const data = {
      stats: stats.value,
      exportDate: new Date().toISOString(),
      period: selectedPeriod.value,
      scanHistory: qrStore.scanHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `arena-stats-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
  }
};

const confirmClearData = () => {
  confirmTitle.value = "Clear Battle History";
  confirmMessage.value =
    "Are you sure you want to clear all scan history? This action cannot be undone.";
  confirmAction.value = "clear";
  showConfirmModal.value = true;
};

const syncData = async () => {
  isSyncing.value = true;
  try {
    await qrStore.syncOfflineData();
    await refreshData();
  } catch (error) {
    console.error("Sync failed:", error);
  } finally {
    isSyncing.value = false;
  }
};

const handleConfirm = () => {
  if (confirmAction.value === "clear") {
    qrStore.clearHistory();
    updateCharts();
  }
  showConfirmModal.value = false;
};

// Lifecycle
onMounted(async () => {
  await refreshData();
  await initializeCharts();
});

onUnmounted(() => {
  if (scanChartInstance) {
    scanChartInstance.destroy();
  }
  if (successChartInstance) {
    successChartInstance.destroy();
  }
});

// Page meta
definePageMeta({
  layout: "mobile",
});

useSeoMeta({
  title: "Statistics - Arena Performance",
  description: "View detailed scanning statistics and analytics",
});
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Page Layout */
.statistics-arena {
  min-height: 100vh;
  background: var(--dark-bg);
  position: relative;
  padding-bottom: 100px; /* Space for bottom nav */
}

/* Background Effects */
.arena-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.statistical-lights {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 40%
    ),
    radial-gradient(circle at 80% 70%, rgba(225, 6, 0, 0.1) 0%, transparent 40%);
  animation: dataFlicker 6s ease-in-out infinite alternate;
}

@keyframes dataFlicker {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

.chart-patterns {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      45deg,
      transparent 49%,
      rgba(255, 215, 0, 0.05) 50%,
      transparent 51%
    ),
    linear-gradient(
      -45deg,
      transparent 49%,
      rgba(225, 6, 0, 0.05) 50%,
      transparent 51%
    );
  background-size: 60px 60px;
}

.data-streams {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 215, 0, 0.1) 50%,
    transparent 100%
  );
  animation: dataStream 8s linear infinite;
}

@keyframes dataStream {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Content */
.stats-content {
  position: relative;
  z-index: 1;
  padding: 1rem;
}

/* Header */
.stats-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-top: env(safe-area-inset-top);
}

.back-btn {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  color: var(--primary-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(225, 6, 0, 0.8);
  border-color: var(--primary-gold);
}

.header-title {
  flex: 1;
  text-align: center;
}

.page-title {
  font-size: 1.5rem;
  color: var(--primary-red);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.page-subtitle {
  font-size: 0.9rem;
  color: var(--primary-gold);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.refresh-btn {
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  color: var(--primary-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(34, 197, 94, 0.8);
  border-color: #22c55e;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Quick Stats */
.quick-stats-section {
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.primary-stat {
  border-color: var(--primary-red);
  background: linear-gradient(
    135deg,
    rgba(225, 6, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.success-stat {
  border-color: #22c55e;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.today-stat {
  border-color: var(--primary-gold);
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.fighters-stat {
  border-color: #3b82f6;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.stat-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
}

.stat-icon {
  font-size: 2rem;
  z-index: 2;
}

.primary-stat .stat-icon {
  color: var(--primary-red);
}

.success-stat .stat-icon {
  color: #22c55e;
}

.today-stat .stat-icon {
  color: var(--primary-gold);
}

.fighters-stat .stat-icon {
  color: #3b82f6;
}

.stat-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  opacity: 0.5;
  animation: statGlow 2s ease-in-out infinite alternate;
}

.primary-stat .stat-glow {
  background: radial-gradient(circle, rgba(225, 6, 0, 0.3) 0%, transparent 70%);
}

.success-stat .stat-glow {
  background: radial-gradient(
    circle,
    rgba(34, 197, 94, 0.3) 0%,
    transparent 70%
  );
}

.today-stat .stat-glow {
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.3) 0%,
    transparent 70%
  );
}

.fighters-stat .stat-glow {
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.3) 0%,
    transparent 70%
  );
}

@keyframes statGlow {
  0% {
    transform: scale(0.8);
    opacity: 0.3;
  }
  100% {
    transform: scale(1.2);
    opacity: 0.6;
  }
}

.stat-value {
  font-size: 2rem;
  color: var(--primary-gold);
  margin: 0 0 0.25rem 0;
  line-height: 1;
}

.stat-label {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.stat-trend.positive {
  color: #22c55e;
}

.stat-trend.negative {
  color: #ef4444;
}

.trend-icon {
  font-size: 1rem;
}

/* Charts Section */
.charts-section {
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-icon {
  font-size: 1.3rem;
  color: var(--primary-red);
}

.chart-title {
  font-size: 1.1rem;
  color: var(--primary-gold);
  margin: 0;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--text-light);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.period-btn.active {
  background: var(--primary-red);
  border-color: var(--primary-gold);
  color: white;
}

.period-btn:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-gold);
}

.chart-container {
  height: 250px;
  position: relative;
}

.pie-chart-container {
  height: 200px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pie-center-stats {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.center-value {
  font-size: 1.5rem;
  color: var(--primary-gold);
  margin: 0;
}

.center-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-light);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-item.success .legend-color {
  background: #22c55e;
}

.legend-item.failure .legend-color {
  background: #e10600;
}

/* Analytics Section */
.analytics-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: var(--primary-red);
  margin: 0 0 1.5rem 0;
}

.section-icon {
  font-size: 1.4rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.analytics-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.analytics-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.analytics-icon {
  font-size: 1.2rem;
  color: var(--primary-red);
}

.analytics-title {
  font-size: 1rem;
  color: var(--primary-gold);
  margin: 0;
}

/* Peak Hours */
.peak-hours {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hour-bar {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 1rem;
}

.hour-label {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 600;
}

.hour-progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.hour-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--primary-red) 0%,
    var(--primary-gold) 100%
  );
  border-radius: 4px;
  transition: width 0.6s ease;
}

.hour-count {
  font-size: 0.9rem;
  color: var(--primary-gold);
  font-weight: 600;
  text-align: right;
}

/* Performance Metrics */
.performance-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.metric-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 1.5rem;
  color: var(--primary-gold);
  margin: 0;
}

/* Top Locations */
.locations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.location-icon {
  font-size: 1.2rem;
  color: var(--primary-red);
}

.location-details {
  flex: 1;
}

.location-name {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.location-stats {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.location-percentage {
  font-size: 1rem;
  color: var(--primary-gold);
  font-weight: 700;
}

/* Actions Section */
.actions-section {
  margin-bottom: 2rem;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.export-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

.clear-btn {
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  color: white;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(225, 6, 0, 0.4);
}

.sync-btn {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
}

.sync-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.4);
}

.sync-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .analytics-grid {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .performance-metrics {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stats-content {
    padding: 0.75rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .page-title {
    font-size: 1.2rem;
  }
}
</style>
