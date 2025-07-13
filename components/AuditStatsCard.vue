<template>
  <div
    class="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 relative overflow-hidden group"
    :class="cardClasses"
  >
    <!-- Background gradient overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity"
      :class="gradientClasses"
    ></div>

    <!-- Icon -->
    <div class="relative z-10 flex items-center gap-4 mb-4">
      <div class="p-3 rounded-xl shadow-lg" :class="iconBgClasses">
        <i :class="[icon, 'text-2xl']" :style="{ color: iconColor }"></i>
      </div>
      <div>
        <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">
          {{ title }}
        </h3>
        <div class="text-3xl font-bold" :class="valueTextClasses">
          {{ formattedValue }}
        </div>
      </div>
    </div>

    <!-- Progress bar (if applicable) -->
    <div v-if="showProgress" class="relative z-10 mt-4">
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span>{{ progressPercentage }}%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all duration-500"
          :class="progressBarClasses"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [Number, String],
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "blue",
    validator: (value: string) =>
      [
        "blue",
        "green",
        "red",
        "yellow",
        "purple",
        "indigo",
        "orange",
        "gray",
      ].includes(value),
  },
  showProgress: {
    type: Boolean,
    default: false,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
});

const colorConfig = {
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    icon: "bg-blue-500/10 text-blue-600",
    iconColor: "#3B82F6",
    value: "text-blue-900",
    progress: "bg-gradient-to-r from-blue-500 to-blue-600",
  },
  green: {
    card: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    gradient: "from-green-500 to-green-600",
    icon: "bg-green-500/10 text-green-600",
    iconColor: "#10B981",
    value: "text-green-900",
    progress: "bg-gradient-to-r from-green-500 to-green-600",
  },
  red: {
    card: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    gradient: "from-red-500 to-red-600",
    icon: "bg-red-500/10 text-red-600",
    iconColor: "#EF4444",
    value: "text-red-900",
    progress: "bg-gradient-to-r from-red-500 to-red-600",
  },
  yellow: {
    card: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
    gradient: "from-yellow-500 to-yellow-600",
    icon: "bg-yellow-500/10 text-yellow-600",
    iconColor: "#F59E0B",
    value: "text-yellow-900",
    progress: "bg-gradient-to-r from-yellow-500 to-yellow-600",
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    gradient: "from-purple-500 to-purple-600",
    icon: "bg-purple-500/10 text-purple-600",
    iconColor: "#8B5CF6",
    value: "text-purple-900",
    progress: "bg-gradient-to-r from-purple-500 to-purple-600",
  },
  indigo: {
    card: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200",
    gradient: "from-indigo-500 to-indigo-600",
    icon: "bg-indigo-500/10 text-indigo-600",
    iconColor: "#6366F1",
    value: "text-indigo-900",
    progress: "bg-gradient-to-r from-indigo-500 to-indigo-600",
  },
  orange: {
    card: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
    gradient: "from-orange-500 to-orange-600",
    icon: "bg-orange-500/10 text-orange-600",
    iconColor: "#F97316",
    value: "text-orange-900",
    progress: "bg-gradient-to-r from-orange-500 to-orange-600",
  },
  gray: {
    card: "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200",
    gradient: "from-gray-500 to-gray-600",
    icon: "bg-gray-500/10 text-gray-600",
    iconColor: "#6B7280",
    value: "text-gray-900",
    progress: "bg-gradient-to-r from-gray-500 to-gray-600",
  },
};

const currentColorConfig = computed(
  () => colorConfig[props.color as keyof typeof colorConfig]
);

const cardClasses = computed(() => currentColorConfig.value.card);
const gradientClasses = computed(() => currentColorConfig.value.gradient);
const iconBgClasses = computed(() => currentColorConfig.value.icon);
const iconColor = computed(() => currentColorConfig.value.iconColor);
const valueTextClasses = computed(() => currentColorConfig.value.value);
const progressBarClasses = computed(() => currentColorConfig.value.progress);

const formattedValue = computed(() => {
  const value = props.value;
  if (typeof value === "number") {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    }
    return value.toLocaleString();
  }
  return value;
});

const progressPercentage = computed(() => {
  if (!props.showProgress || typeof props.value !== "number") return 0;
  return Math.min((props.value / props.maxValue) * 100, 100);
});
</script>

<style scoped>
/* Additional custom styling can go here */
</style>
