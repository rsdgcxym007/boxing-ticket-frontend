<template>
  <div class="live-counter">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
        {{ title }}
      </h3>
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span class="text-sm text-gray-600 dark:text-gray-400">สด</span>
      </div>
    </div>

    <!-- Counter Display -->
    <div class="counter-display">
      <div class="text-center mb-6">
        <div
          class="text-6xl font-bold transition-all duration-500 ease-out"
          :class="[
            animationClass,
            countValue > prevCount
              ? 'text-green-600'
              : countValue < prevCount
              ? 'text-red-600'
              : 'text-blue-600',
          ]"
        >
          {{ formattedCount }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {{ subtitle }}
        </div>
      </div>

      <!-- Trend Indicator -->
      <div class="flex items-center justify-center gap-4 mb-6">
        <div class="flex items-center gap-2">
          <Icon
            :icon="
              trend === 'up'
                ? 'mdi:trending-up'
                : trend === 'down'
                ? 'mdi:trending-down'
                : 'mdi:trending-neutral'
            "
            :class="[
              'text-lg',
              trend === 'up'
                ? 'text-green-500'
                : trend === 'down'
                ? 'text-red-500'
                : 'text-gray-500',
            ]"
          />
          <span
            class="text-sm font-medium"
            :class="[
              trend === 'up'
                ? 'text-green-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600',
            ]"
          >
            {{ trendText }}
          </span>
        </div>

        <div class="text-sm text-gray-500">
          ในช่วง {{ updateInterval }}s ที่ผ่านมา
        </div>
      </div>

      <!-- Mini Chart -->
      <div v-if="showChart" class="chart-container mb-4">
        <canvas ref="chartCanvas" class="w-full h-20"></canvas>
      </div>

      <!-- Statistics Grid -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          <div class="text-xl font-bold text-gray-800 dark:text-white">
            {{ stats.peak }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">สูงสุด</div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          <div class="text-xl font-bold text-gray-800 dark:text-white">
            {{ stats.average }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">เฉลี่ย</div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          <div class="text-xl font-bold text-gray-800 dark:text-white">
            {{ stats.low }}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">ต่ำสุด</div>
        </div>
      </div>

      <!-- Additional Metrics -->
      <div v-if="metrics.length > 0" class="additional-metrics">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          เมตริกส์เพิ่มเติม
        </h4>
        <div class="space-y-2">
          <div
            v-for="metric in metrics"
            :key="metric.key"
            class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
          >
            <div class="flex items-center gap-2">
              <Icon :icon="metric.icon" class="text-gray-500" />
              <span class="text-sm text-gray-700 dark:text-gray-300">{{
                metric.label
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-gray-800 dark:text-white">
                {{ metric.value }}
              </span>
              <div
                v-if="metric.change !== undefined"
                class="flex items-center gap-1"
                :class="[
                  metric.change > 0
                    ? 'text-green-600'
                    : metric.change < 0
                    ? 'text-red-600'
                    : 'text-gray-500',
                ]"
              >
                <Icon
                  :icon="
                    metric.change > 0
                      ? 'mdi:arrow-up'
                      : metric.change < 0
                      ? 'mdi:arrow-down'
                      : 'mdi:minus'
                  "
                  class="text-xs"
                />
                <span class="text-xs">{{ Math.abs(metric.change) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls mt-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <button
              @click="toggleAutoUpdate"
              :class="[
                'flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors',
                autoUpdate
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
              ]"
            >
              <Icon :icon="autoUpdate ? 'mdi:play' : 'mdi:pause'" />
              {{ autoUpdate ? "เปิด" : "ปิด" }}
            </button>

            <select
              v-model="updateInterval"
              class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 border-0 rounded"
            >
              <option value="1">1s</option>
              <option value="5">5s</option>
              <option value="10">10s</option>
              <option value="30">30s</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button
              @click="resetCounter"
              class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              รีเซ็ต
            </button>
            <button
              @click="exportData"
              class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/30"
            >
              ส่งออก
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alerts -->
    <div v-if="alerts.length > 0" class="alerts mt-4">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="flex items-start gap-2 p-3 mb-2 rounded-lg"
        :class="[
          alert.type === 'warning'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            : alert.type === 'danger'
            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
        ]"
      >
        <Icon
          :icon="
            alert.type === 'warning'
              ? 'mdi:alert'
              : alert.type === 'danger'
              ? 'mdi:alert-circle'
              : 'mdi:information'
          "
          :class="[
            'text-lg mt-0.5',
            alert.type === 'warning'
              ? 'text-yellow-600'
              : alert.type === 'danger'
              ? 'text-red-600'
              : 'text-blue-600',
          ]"
        />
        <div class="flex-1">
          <div
            class="font-medium text-sm"
            :class="[
              alert.type === 'warning'
                ? 'text-yellow-800 dark:text-yellow-200'
                : alert.type === 'danger'
                ? 'text-red-800 dark:text-red-200'
                : 'text-blue-800 dark:text-blue-200',
            ]"
          >
            {{ alert.title }}
          </div>
          <div
            class="text-xs mt-1"
            :class="[
              alert.type === 'warning'
                ? 'text-yellow-700 dark:text-yellow-300'
                : alert.type === 'danger'
                ? 'text-red-700 dark:text-red-300'
                : 'text-blue-700 dark:text-blue-300',
            ]"
          >
            {{ alert.message }}
          </div>
        </div>
        <button
          @click="dismissAlert(alert.id)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <Icon icon="mdi:close" />
        </button>
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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

// Props
const props = defineProps({
  title: {
    type: String,
    default: "ผู้ใช้ออนไลน์",
  },
  subtitle: {
    type: String,
    default: "คนที่เข้าชมขณะนี้",
  },
  initialValue: {
    type: Number,
    default: 0,
  },
  maxValue: {
    type: Number,
    default: null,
  },
  minValue: {
    type: Number,
    default: 0,
  },
  showChart: {
    type: Boolean,
    default: true,
  },
  thresholds: {
    type: Object,
    default: () => ({
      warning: 80, // percent of maxValue
      danger: 95,
    }),
  },
});

// Reactive data
const chartCanvas = ref(null);
const chart = ref(null);
const countValue = ref(props.initialValue);
const prevCount = ref(props.initialValue);
const animationClass = ref("");
const autoUpdate = ref(true);
const updateInterval = ref(5);
const alerts = ref([]);

// Historical data for chart and stats
const history = ref([]);
const maxHistoryLength = 20;

// Computed
const formattedCount = computed(() => {
  return new Intl.NumberFormat("th-TH").format(countValue.value);
});

const trend = computed(() => {
  if (history.value.length < 2) return "neutral";

  const recent = history.value.slice(-3);
  const avg = recent.reduce((sum, val) => sum + val, 0) / recent.length;

  if (countValue.value > avg * 1.1) return "up";
  if (countValue.value < avg * 0.9) return "down";
  return "neutral";
});

const trendText = computed(() => {
  const trendMap = {
    up: "เพิ่มขึ้น",
    down: "ลดลง",
    neutral: "คงที่",
  };
  return trendMap[trend.value];
});

const stats = computed(() => {
  if (history.value.length === 0) {
    return { peak: 0, average: 0, low: 0 };
  }

  return {
    peak: Math.max(...history.value),
    average: Math.round(
      history.value.reduce((sum, val) => sum + val, 0) / history.value.length
    ),
    low: Math.min(...history.value),
  };
});

const metrics = computed(() => [
  {
    key: "session_duration",
    label: "เซสชันเฉลี่ย",
    value: "4.2 นาที",
    icon: "mdi:clock",
    change: 0.3,
  },
  {
    key: "active_bookings",
    label: "การจองที่กำลังดำเนินการ",
    value: Math.floor(countValue.value * 0.15),
    icon: "mdi:ticket",
    change: 2,
  },
  {
    key: "page_views",
    label: "การดูหน้าต่อนาที",
    value: Math.floor(countValue.value * 2.5),
    icon: "mdi:eye",
    change: -5,
  },
]);

// Methods
const updateCount = () => {
  prevCount.value = countValue.value;

  // Simulate realistic user count changes
  const change = Math.floor((Math.random() - 0.5) * 20);
  let newValue = countValue.value + change;

  // Apply constraints
  if (props.maxValue) {
    newValue = Math.min(newValue, props.maxValue);
  }
  newValue = Math.max(newValue, props.minValue);

  countValue.value = newValue;

  // Add to history
  history.value.push(newValue);
  if (history.value.length > maxHistoryLength) {
    history.value.shift();
  }

  // Trigger animation
  animationClass.value = "animate-pulse";
  setTimeout(() => {
    animationClass.value = "";
  }, 500);

  // Update chart
  updateChart();

  // Check thresholds
  checkThresholds();
};

const initChart = () => {
  if (!chartCanvas.value || !props.showChart) return;

  const ctx = chartCanvas.value.getContext("2d");

  chart.value = new ChartJS(ctx, {
    type: "line",
    data: {
      labels: Array.from(
        { length: maxHistoryLength },
        (_, i) => i - maxHistoryLength + 1
      ),
      datasets: [
        {
          data: history.value,
          borderColor: "#3B82F6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: { display: false },
        y: { display: false },
      },
      animation: { duration: 0 },
    },
  });
};

const updateChart = () => {
  if (!chart.value) return;

  chart.value.data.datasets[0].data = [...history.value];
  chart.value.update("none");
};

const checkThresholds = () => {
  if (!props.maxValue) return;

  const percentage = (countValue.value / props.maxValue) * 100;

  if (percentage >= props.thresholds.danger) {
    addAlert(
      "danger",
      "การใช้งานสูงมาก",
      `ผู้ใช้ออนไลน์ ${percentage.toFixed(1)}% ของขีดจำกัด`
    );
  } else if (percentage >= props.thresholds.warning) {
    addAlert(
      "warning",
      "การใช้งานสูง",
      `ผู้ใช้ออนไลน์ ${percentage.toFixed(1)}% ของขีดจำกัด`
    );
  }
};

const addAlert = (type, title, message) => {
  // Avoid duplicate alerts
  const exists = alerts.value.some(
    (alert) => alert.type === type && alert.title === title
  );

  if (exists) return;

  const alert = {
    id: Date.now(),
    type,
    title,
    message,
    timestamp: new Date(),
  };

  alerts.value.push(alert);

  // Auto dismiss after 10 seconds
  setTimeout(() => {
    dismissAlert(alert.id);
  }, 10000);
};

const dismissAlert = (alertId) => {
  alerts.value = alerts.value.filter((alert) => alert.id !== alertId);
};

const toggleAutoUpdate = () => {
  autoUpdate.value = !autoUpdate.value;
};

const resetCounter = () => {
  countValue.value = props.initialValue;
  prevCount.value = props.initialValue;
  history.value = [];
  alerts.value = [];

  if (chart.value) {
    chart.value.data.datasets[0].data = [];
    chart.value.update();
  }
};

const exportData = () => {
  const data = {
    current: countValue.value,
    history: history.value,
    stats: stats.value,
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `live-counter-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Auto update logic
let updateTimer = null;

const startAutoUpdate = () => {
  if (updateTimer) clearInterval(updateTimer);

  updateTimer = setInterval(() => {
    if (autoUpdate.value) {
      updateCount();
    }
  }, updateInterval.value * 1000);
};

// Watch for changes
watch(autoUpdate, (newValue) => {
  if (newValue) {
    startAutoUpdate();
  } else if (updateTimer) {
    clearInterval(updateTimer);
  }
});

watch(updateInterval, () => {
  if (autoUpdate.value) {
    startAutoUpdate();
  }
});

// Lifecycle
onMounted(() => {
  // Initialize with some history
  for (let i = 0; i < 10; i++) {
    history.value.push(
      props.initialValue + Math.floor((Math.random() - 0.5) * 50)
    );
  }

  initChart();

  if (autoUpdate.value) {
    startAutoUpdate();
  }
});

onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer);
  }
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.live-counter {
  width: 100%;
  padding: 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.dark .live-counter {
  background: #1f2937;
}

.counter-display {
  text-align: center;
}

.animate-pulse {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
