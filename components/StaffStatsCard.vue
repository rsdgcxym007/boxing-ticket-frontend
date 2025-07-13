<template>
  <div class="stat-card" :class="cardClasses">
    <div class="relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5" :class="backgroundPattern"></div>

      <!-- Content -->
      <div class="relative z-10 flex items-center justify-between">
        <div class="flex-1">
          <dt class="text-sm font-medium text-gray-600 mb-1">
            {{ title }}
          </dt>
          <dd class="text-3xl font-bold" :class="valueClasses">
            {{ formattedValue }}
            <span class="text-sm font-normal text-gray-500 ml-1">คน</span>
          </dd>
          <!-- Growth indicator (placeholder) -->
          <div class="flex items-center mt-2 text-xs">
            <i class="mdi mdi-trending-up text-green-500 mr-1"></i>
            <span class="text-gray-500">+5% จากเดือนที่แล้ว</span>
          </div>
        </div>

        <div class="flex-shrink-0 ml-4">
          <div class="stat-icon" :class="iconClasses">
            <i :class="icon" class="text-2xl"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title: string;
  value: number;
  icon: string;
  color?: "blue" | "green" | "yellow" | "red" | "gray";
}

const props = withDefaults(defineProps<Props>(), {
  color: "blue",
});

const cardClasses = computed(() => [
  "bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100",
  "group cursor-pointer",
]);

const iconClasses = computed(() => {
  const colorClasses = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/25",
    green:
      "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-500/25",
    yellow:
      "bg-gradient-to-br from-yellow-500 to-yellow-600 text-white shadow-yellow-500/25",
    red: "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-500/25",
    gray: "bg-gradient-to-br from-gray-500 to-gray-600 text-white shadow-gray-500/25",
  };

  return [
    "w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
    colorClasses[props.color],
  ];
});

const valueClasses = computed(() => {
  const colorClasses = {
    blue: "text-blue-700",
    green: "text-green-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
    gray: "text-gray-700",
  };

  return colorClasses[props.color];
});

const backgroundPattern = computed(() => {
  const patterns = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    gray: "bg-gray-500",
  };

  return patterns[props.color];
});

const formattedValue = computed(() => {
  return new Intl.NumberFormat("th-TH").format(props.value);
});
</script>

<style scoped>
.stat-card {
  border: 1px solid #e5e7eb;
}

.stat-icon {
  transition: transform 0.2s ease-in-out;
}

.stat-card:hover .stat-icon {
  transform: scale(1.1);
}

/* Custom background patterns */
.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, currentColor 1px, transparent 1px);
  background-size: 10px 10px;
  opacity: 0.05;
  z-index: 1;
}

/* Hover animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Gradient text animation */
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient-x 6s ease infinite;
}
</style>
