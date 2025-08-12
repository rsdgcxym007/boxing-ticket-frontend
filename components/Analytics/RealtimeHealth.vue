<template>
  <div class="realtime-health-container">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
        สุขภาพระบบเรียลไทม์
      </h3>
      <div class="flex items-center gap-2">
        <div
          class="w-3 h-3 rounded-full"
          :class="
            systemStatus === 'healthy'
              ? 'bg-green-500'
              : systemStatus === 'warning'
              ? 'bg-yellow-500'
              : 'bg-red-500'
          "
        ></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">
          {{ getStatusText(systemStatus) }}
        </span>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- Server Status -->
      <div
        class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
      >
        <div class="flex items-center justify-between mb-2">
          <Icon icon="mdi:server" class="text-2xl text-blue-600" />
          <div
            class="w-2 h-2 rounded-full"
            :class="
              healthData.server.status === 'online'
                ? 'bg-green-500'
                : 'bg-red-500'
            "
          ></div>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">เซิร์ฟเวอร์</div>
        <div class="text-lg font-bold text-gray-800 dark:text-white">
          {{ healthData.server.status === "online" ? "ออนไลน์" : "ออฟไลน์" }}
        </div>
        <div class="text-xs text-gray-500">
          อัปไทม์: {{ healthData.server.uptime }}
        </div>
      </div>

      <!-- Database Status -->
      <div
        class="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
      >
        <div class="flex items-center justify-between mb-2">
          <Icon icon="mdi:database" class="text-2xl text-green-600" />
          <div
            class="w-2 h-2 rounded-full"
            :class="
              healthData.database.status === 'connected'
                ? 'bg-green-500'
                : 'bg-red-500'
            "
          ></div>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">ฐานข้อมูล</div>
        <div class="text-lg font-bold text-gray-800 dark:text-white">
          {{ healthData.database.responseTime }}ms
        </div>
        <div class="text-xs text-gray-500">
          การเชื่อมต่อ: {{ healthData.database.connections }} /
          {{ healthData.database.maxConnections }}
        </div>
      </div>

      <!-- Memory Usage -->
      <div
        class="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700"
      >
        <div class="flex items-center justify-between mb-2">
          <Icon icon="mdi:memory" class="text-2xl text-purple-600" />
          <span
            class="text-xs font-medium"
            :class="
              healthData.memory.percentage > 80
                ? 'text-red-600'
                : 'text-gray-600'
            "
          >
            {{ healthData.memory.percentage }}%
          </span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">หน่วยความจำ</div>
        <div class="text-lg font-bold text-gray-800 dark:text-white">
          {{ healthData.memory.used }} / {{ healthData.memory.total }}
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="
              healthData.memory.percentage > 80
                ? 'bg-red-500'
                : healthData.memory.percentage > 60
                ? 'bg-yellow-500'
                : 'bg-green-500'
            "
            :style="{ width: `${healthData.memory.percentage}%` }"
          ></div>
        </div>
      </div>

      <!-- CPU Usage -->
      <div
        class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700"
      >
        <div class="flex items-center justify-between mb-2">
          <Icon icon="mdi:chip" class="text-2xl text-orange-600" />
          <span
            class="text-xs font-medium"
            :class="
              healthData.cpu.percentage > 80 ? 'text-red-600' : 'text-gray-600'
            "
          >
            {{ healthData.cpu.percentage }}%
          </span>
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400">CPU</div>
        <div class="text-lg font-bold text-gray-800 dark:text-white">
          {{ healthData.cpu.cores }} Cores
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="
              healthData.cpu.percentage > 80
                ? 'bg-red-500'
                : healthData.cpu.percentage > 60
                ? 'bg-yellow-500'
                : 'bg-green-500'
            "
            :style="{ width: `${healthData.cpu.percentage}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Real-time Metrics Chart -->
    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-6"
    >
      <h4 class="text-lg font-medium text-gray-800 dark:text-white mb-4">
        เมตริกส์เรียลไทม์ (อัปเดตทุก 5 วินาที)
      </h4>
      <div class="relative h-48">
        <canvas ref="metricsChart" class="w-full h-full"></canvas>
      </div>
    </div>

    <!-- Active Services -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Services Status -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h4 class="text-lg font-medium text-gray-800 dark:text-white mb-4">
          สถานะบริการ
        </h4>
        <div class="space-y-3">
          <div
            v-for="service in healthData.services"
            :key="service.name"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-3 h-3 rounded-full"
                :class="
                  service.status === 'running'
                    ? 'bg-green-500'
                    : service.status === 'warning'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                "
              ></div>
              <div>
                <div class="font-medium text-gray-800 dark:text-white">
                  {{ service.name }}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {{ service.description }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-gray-800 dark:text-white">
                {{ service.responseTime }}ms
              </div>
              <div class="text-xs text-gray-500">
                {{ service.lastCheck }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Logs -->
      <div
        class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-medium text-gray-800 dark:text-white">
            ข้อผิดพลาดล่าสุด
          </h4>
          <button
            @click="refreshLogs"
            class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon icon="mdi:refresh" class="inline mr-1" />
            รีเฟรช
          </button>
        </div>
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="log in healthData.recentErrors"
            :key="log.id"
            class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div class="flex items-start gap-2">
              <Icon
                icon="mdi:alert-circle"
                class="text-red-500 text-lg mt-0.5"
              />
              <div class="flex-1">
                <div class="font-medium text-red-800 dark:text-red-200">
                  {{ log.message }}
                </div>
                <div class="text-sm text-red-600 dark:text-red-400">
                  {{ log.service }} • {{ log.timestamp }}
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="healthData.recentErrors.length === 0"
            class="text-center py-4"
          >
            <Icon
              icon="mdi:check-circle"
              class="text-green-500 text-3xl mb-2"
            />
            <p class="text-gray-600 dark:text-gray-400">ไม่มีข้อผิดพลาด</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-time Alerts -->
    <div v-if="alerts.length > 0" class="fixed bottom-4 right-4 z-50 space-y-2">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="bg-red-600 text-white p-3 rounded-lg shadow-lg max-w-sm"
      >
        <div class="flex items-start gap-2">
          <Icon icon="mdi:alert" class="text-lg mt-0.5" />
          <div class="flex-1">
            <div class="font-medium">{{ alert.title }}</div>
            <div class="text-sm opacity-90">{{ alert.message }}</div>
          </div>
          <button
            @click="dismissAlert(alert.id)"
            class="text-white/80 hover:text-white"
          >
            <Icon icon="mdi:close" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Reactive data
const metricsChart = ref(null);
const chart = ref(null);
const alerts = ref([]);

const healthData = ref({
  server: {
    status: "online",
    uptime: "15 วัน 3 ชั่วโมง",
    lastRestart: "2024-01-01 12:00:00",
  },
  database: {
    status: "connected",
    responseTime: 45,
    connections: 23,
    maxConnections: 100,
  },
  memory: {
    used: "2.4 GB",
    total: "8.0 GB",
    percentage: 30,
  },
  cpu: {
    percentage: 45,
    cores: 4,
    load: [0.8, 1.2, 0.9],
  },
  services: [
    {
      name: "API Gateway",
      description: "Main API endpoint",
      status: "running",
      responseTime: 123,
      lastCheck: "2 นาทีที่แล้ว",
    },
    {
      name: "Database",
      description: "PostgreSQL database",
      status: "running",
      responseTime: 45,
      lastCheck: "1 นาทีที่แล้ว",
    },
    {
      name: "Cache Redis",
      description: "Redis cache server",
      status: "running",
      responseTime: 12,
      lastCheck: "30 วินาทีที่แล้ว",
    },
    {
      name: "WebSocket",
      description: "Real-time messaging",
      status: "warning",
      responseTime: 234,
      lastCheck: "5 นาทีที่แล้ว",
    },
  ],
  recentErrors: [
    {
      id: 1,
      message: "Database connection timeout",
      service: "API Gateway",
      timestamp: "15:30:25",
      severity: "warning",
    },
    {
      id: 2,
      message: "High memory usage detected",
      service: "Server Monitor",
      timestamp: "15:25:10",
      severity: "warning",
    },
  ],
});

const systemStatus = computed(() => {
  const errorCount = healthData.value.recentErrors.length;
  const warningServices = healthData.value.services.filter(
    (s) => s.status === "warning"
  ).length;
  const highResourceUsage =
    healthData.value.memory.percentage > 80 ||
    healthData.value.cpu.percentage > 80;

  if (errorCount > 5 || warningServices > 2 || highResourceUsage) {
    return "critical";
  } else if (errorCount > 0 || warningServices > 0) {
    return "warning";
  }
  return "healthy";
});

// Methods
const getStatusText = (status) => {
  const statusMap = {
    healthy: "ระบบทำงานปกติ",
    warning: "มีคำเตือน",
    critical: "ต้องแก้ไขด่วน",
  };
  return statusMap[status] || "ไม่ทราบสถานะ";
};

const initMetricsChart = () => {
  if (!metricsChart.value) return;

  const ctx = metricsChart.value.getContext("2d");
  const labels = Array.from({ length: 20 }, (_, i) => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - (19 - i));
    return time.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  });

  chart.value = new ChartJS(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "CPU (%)",
          data: Array.from({ length: 20 }, () => Math.random() * 100),
          borderColor: "#F59E0B",
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          tension: 0.4,
        },
        {
          label: "Memory (%)",
          data: Array.from({ length: 20 }, () => Math.random() * 100),
          borderColor: "#8B5CF6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          tension: 0.4,
        },
        {
          label: "Network (MB/s)",
          data: Array.from({ length: 20 }, () => Math.random() * 50),
          borderColor: "#10B981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            boxWidth: 12,
            font: {
              size: 12,
            },
          },
        },
      },
      scales: {
        x: {
          display: true,
          ticks: {
            maxTicksLimit: 6,
          },
        },
        y: {
          display: true,
          min: 0,
          max: 100,
        },
      },
      animation: {
        duration: 0,
      },
    },
  });
};

const updateMetrics = () => {
  if (!chart.value) return;

  // Simulate real-time data updates
  const newLabel = new Date().toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  chart.value.data.labels.shift();
  chart.value.data.labels.push(newLabel);

  chart.value.data.datasets.forEach((dataset) => {
    dataset.data.shift();
    dataset.data.push(Math.random() * 100);
  });

  chart.value.update("none");

  // Update health data
  healthData.value.memory.percentage = Math.floor(Math.random() * 40) + 20;
  healthData.value.cpu.percentage = Math.floor(Math.random() * 60) + 20;
  healthData.value.database.responseTime = Math.floor(Math.random() * 100) + 20;
};

const refreshLogs = () => {
  // Simulate log refresh
  console.log("Refreshing error logs...");
};

const dismissAlert = (alertId) => {
  alerts.value = alerts.value.filter((alert) => alert.id !== alertId);
};

const addAlert = (title, message) => {
  const alert = {
    id: Date.now(),
    title,
    message,
    timestamp: new Date(),
  };

  alerts.value.push(alert);

  // Auto-dismiss after 10 seconds
  setTimeout(() => {
    dismissAlert(alert.id);
  }, 10000);
};

// Real-time updates
let updateInterval = null;

onMounted(() => {
  initMetricsChart();

  // Start real-time updates
  updateInterval = setInterval(updateMetrics, 5000);

  // Simulate occasional alerts
  setTimeout(() => {
    addAlert("CPU Usage High", "CPU usage exceeded 80% threshold");
  }, 15000);
});

onUnmounted(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.realtime-health-container {
  @apply w-full h-full;
}
</style>
