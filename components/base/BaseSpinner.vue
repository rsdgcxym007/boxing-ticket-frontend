<!-- BaseSpinner.vue -->
<template>
  <div class="flex items-center justify-center">
    <div :class="spinnerClasses">
      <div
        class="animate-spin rounded-full border-solid border-t-transparent"
        :class="sizeClasses"
      ></div>
    </div>
    <span v-if="text" class="ml-2 text-sm text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  color: "primary",
});

const sizeClasses = computed(() => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };
  return sizes[props.size];
});

const spinnerClasses = computed(() => {
  const colors = {
    primary: "border-blue-200 border-t-blue-600",
    secondary: "border-gray-200 border-t-gray-600",
    success: "border-green-200 border-t-green-600",
    warning: "border-yellow-200 border-t-yellow-600",
    danger: "border-red-200 border-t-red-600",
  };

  return `rounded-full ${colors[props.color]}`;
});
</script>
