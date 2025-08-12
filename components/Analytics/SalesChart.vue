<template>
  <div class="sales-chart-container">
    <!-- Chart Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
        {{ title }}
      </h3>
      <div class="flex gap-2">
        <button
          v-for="period in timePeriods"
          :key="period.value"
          @click="selectedPeriod = period.value"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            selectedPeriod === period.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Chart Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      ></div>
    </div>

    <!-- Chart Error State -->
    <div v-else-if="error" class="flex items-center justify-center h-64">
      <div class="text-center">
        <Icon icon="mdi:alert-circle" class="text-5xl text-red-500 mb-2" />
        <p class="text-gray-600 dark:text-gray-400">{{ error }}</p>
        <button
          @click="refreshChart"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ลองใหม่
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div v-else class="relative">
      <canvas
        ref="chartCanvas"
        :width="chartWidth"
        :height="chartHeight"
        class="max-w-full"
      ></canvas>

      <!-- Chart Controls -->
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-blue-600 rounded"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">ยอดขาย</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-4 bg-green-600 rounded"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400"
              >เป้าหมาย</span
            >
          </div>
        </div>

        <div class="flex gap-2">
          <button
            @click="downloadChart"
            class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon icon="mdi:download" class="inline mr-1" />
            ดาวน์โหลด
          </button>
          <button
            @click="toggleFullscreen"
            class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Icon icon="mdi:fullscreen" class="inline mr-1" />
            เต็มจอ
          </button>
        </div>
      </div>

      <!-- Chart Statistics -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-400">ยอดขายรวม</div>
          <div class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ formatCurrency(totalSales) }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            เฉลี่ยต่อวัน
          </div>
          <div class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ formatCurrency(averageDaily) }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-400">การเติบโต</div>
          <div
            class="text-2xl font-bold"
            :class="growthRate >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ growthRate >= 0 ? "+" : "" }}{{ growthRate.toFixed(1) }}%
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            วันที่ดีที่สุด
          </div>
          <div class="text-lg font-bold text-gray-800 dark:text-white">
            {{ formatCurrency(bestDay.amount) }}
          </div>
          <div class="text-xs text-gray-500">{{ bestDay.date }}</div>
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
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Props
const props = defineProps({
  title: {
    type: String,
    default: "ยอดขายตามช่วงเวลา",
  },
  chartType: {
    type: String,
    default: "line", // line, bar, area
    validator: (value) => ["line", "bar", "area"].includes(value),
  },
  height: {
    type: Number,
    default: 300,
  },
  width: {
    type: Number,
    default: null,
  },
});

// Reactive data
const chartCanvas = ref(null);
const chart = ref(null);
const loading = ref(false);
const error = ref(null);
const selectedPeriod = ref("7d");

const timePeriods = [
  { label: "7 วัน", value: "7d" },
  { label: "30 วัน", value: "30d" },
  { label: "3 เดือน", value: "3m" },
  { label: "1 ปี", value: "1y" },
];

// Chart data
const chartData = ref({
  labels: [],
  datasets: [],
});

const chartWidth = computed(() => props.width || 600);
const chartHeight = computed(() => props.height);

// Computed statistics
const totalSales = computed(() => {
  if (!chartData.value.datasets[0]?.data) return 0;
  return chartData.value.datasets[0].data.reduce(
    (sum, value) => sum + value,
    0
  );
});

const averageDaily = computed(() => {
  if (!chartData.value.datasets[0]?.data?.length) return 0;
  return totalSales.value / chartData.value.datasets[0].data.length;
});

const growthRate = computed(() => {
  const data = chartData.value.datasets[0]?.data;
  if (!data || data.length < 2) return 0;

  const recent = data.slice(-7).reduce((sum, val) => sum + val, 0);
  const previous = data.slice(-14, -7).reduce((sum, val) => sum + val, 0);

  if (previous === 0) return 0;
  return ((recent - previous) / previous) * 100;
});

const bestDay = computed(() => {
  const data = chartData.value.datasets[0]?.data;
  const labels = chartData.value.labels;

  if (!data || !labels || data.length === 0) {
    return { amount: 0, date: "-" };
  }

  const maxIndex = data.indexOf(Math.max(...data));
  return {
    amount: data[maxIndex],
    date: labels[maxIndex],
  };
});

// Methods
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  }).format(amount);
};

const generateMockData = (period) => {
  const days =
    period === "7d" ? 7 : period === "30d" ? 30 : period === "3m" ? 90 : 365;
  const labels = [];
  const data = [];
  const targets = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    labels.push(
      date.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
      })
    );

    // Generate realistic sales data
    const baseAmount = 50000 + Math.random() * 30000;
    const seasonality = Math.sin((i / days) * Math.PI * 2) * 10000;
    const weekendBoost = [0, 6].includes(date.getDay()) ? 15000 : 0;

    data.push(
      Math.max(
        0,
        baseAmount + seasonality + weekendBoost + (Math.random() - 0.5) * 20000
      )
    );
    targets.push(75000);
  }

  return { labels, data, targets };
};

const initChart = () => {
  if (!chartCanvas.value) return;

  const { labels, data, targets } = generateMockData(selectedPeriod.value);

  chartData.value = {
    labels,
    datasets: [
      {
        label: "ยอดขาย",
        data,
        borderColor: "#3B82F6",
        backgroundColor:
          props.chartType === "area"
            ? "rgba(59, 130, 246, 0.1)"
            : "rgba(59, 130, 246, 0.8)",
        borderWidth: 2,
        fill: props.chartType === "area",
        tension: props.chartType === "line" ? 0.4 : 0,
        type: props.chartType === "bar" ? "bar" : "line",
      },
      {
        label: "เป้าหมาย",
        data: targets,
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        type: "line",
      },
    ],
  };

  const config = {
    type: props.chartType === "bar" ? "bar" : "line",
    data: chartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: false,
        },
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "white",
          bodyColor: "white",
          borderColor: "#3B82F6",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return (
                context.dataset.label + ": " + formatCurrency(context.parsed.y)
              );
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(107, 114, 128, 0.1)",
          },
          ticks: {
            color: "#6B7280",
          },
        },
        y: {
          grid: {
            color: "rgba(107, 114, 128, 0.1)",
          },
          ticks: {
            color: "#6B7280",
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
      animation: {
        duration: 1000,
        easing: "easeInOutQuart",
      },
    },
  };

  // Destroy existing chart
  if (chart.value) {
    chart.value.destroy();
  }

  chart.value = new ChartJS(chartCanvas.value, config);
};

const refreshChart = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    initChart();
  } catch (err) {
    error.value = "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง";
  } finally {
    loading.value = false;
  }
};

const downloadChart = () => {
  if (chart.value) {
    const link = document.createElement("a");
    link.download = `sales-chart-${selectedPeriod.value}-${
      new Date().toISOString().split("T")[0]
    }.png`;
    link.href = chart.value.toBase64Image();
    link.click();
  }
};

const toggleFullscreen = () => {
  // Implementation for fullscreen mode
  console.log("Toggle fullscreen mode");
};

// Watch for period changes
watch(selectedPeriod, () => {
  refreshChart();
});

// Initialize chart on mount
onMounted(() => {
  refreshChart();
});

// Cleanup on unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
.sales-chart-container {
  @apply w-full h-full p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm;
}
</style>
