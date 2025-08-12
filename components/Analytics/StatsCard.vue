<template>
  <div class="analytics-stats-card">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {{ title }}
        </p>
        <p class="text-3xl font-bold text-gray-900 mt-2">
          {{ formattedValue }}
        </p>
        <div v-if="change" class="flex items-center mt-2">
          <Icon :name="trendIcon" :class="['w-4 h-4 mr-1', trendColor]" />
          <span :class="['text-sm font-medium', trendColor]">
            {{ change }}
          </span>
          <span class="text-sm text-gray-500 ml-1">from last period</span>
        </div>
      </div>

      <div :class="['p-3 rounded-full', iconBackgroundColor]">
        <Icon :name="icon" :class="['w-6 h-6', iconColor]" />
      </div>
    </div>

    <!-- Mini chart or additional info -->
    <div v-if="chartData" class="mt-4">
      <div class="h-16 flex items-end space-x-1">
        <div
          v-for="(value, index) in chartData"
          :key="index"
          :class="['bg-gray-300 rounded-sm', miniBarColor]"
          :style="{
            height: `${(value / Math.max(...chartData)) * 100}%`,
            width: '8px',
          }"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
    >
      <Icon
        name="heroicons:arrow-path"
        class="w-5 h-5 animate-spin text-gray-500"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: string;
  color?: "green" | "blue" | "purple" | "orange" | "red" | "gray";
  loading?: boolean;
  chartData?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  color: "blue",
  loading: false,
  trend: "neutral",
});

const formattedValue = computed(() => {
  if (typeof props.value === "number") {
    if (props.value >= 1000000) {
      return (props.value / 1000000).toFixed(1) + "M";
    } else if (props.value >= 1000) {
      return (props.value / 1000).toFixed(1) + "K";
    }
    return props.value.toLocaleString();
  }
  return props.value;
});

const trendIcon = computed(() => {
  switch (props.trend) {
    case "up":
      return "heroicons:arrow-trending-up";
    case "down":
      return "heroicons:arrow-trending-down";
    default:
      return "heroicons:minus";
  }
});

const trendColor = computed(() => {
  switch (props.trend) {
    case "up":
      return "text-green-600";
    case "down":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
});

const iconColor = computed(() => {
  const colorMap = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    gray: "text-gray-600",
  };
  return colorMap[props.color];
});

const iconBackgroundColor = computed(() => {
  const colorMap = {
    green: "bg-green-100",
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    orange: "bg-orange-100",
    red: "bg-red-100",
    gray: "bg-gray-100",
  };
  return colorMap[props.color];
});

const miniBarColor = computed(() => {
  const colorMap = {
    green: "bg-green-400",
    blue: "bg-blue-400",
    purple: "bg-purple-400",
    orange: "bg-orange-400",
    red: "bg-red-400",
    gray: "bg-gray-400",
  };
  return colorMap[props.color];
});
</script>

<style scoped>
.analytics-stats-card {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.analytics-stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
