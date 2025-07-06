<!-- BaseCard.vue -->
<template>
  <div :class="cardClasses">
    <div
      v-if="title || $slots.header"
      class="px-4 py-5 border-b border-gray-200 sm:px-6"
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-medium text-gray-900">
          <slot name="header">{{ title }}</slot>
        </h3>
        <div v-if="$slots.actions" class="flex space-x-2">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <div class="px-4 py-5 sm:p-6">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="px-4 py-4 border-t border-gray-200 sm:px-6"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  title?: string;
  variant?: "default" | "bordered" | "shadow" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  padding: "md",
});

const cardClasses = computed(() => {
  const baseClasses = "bg-white overflow-hidden rounded-lg";

  const variants = {
    default: "",
    bordered: "border border-gray-200",
    shadow: "shadow-md",
    elevated: "shadow-lg",
  };

  return `${baseClasses} ${variants[props.variant]}`;
});
</script>
