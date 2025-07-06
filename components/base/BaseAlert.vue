<!-- BaseAlert.vue -->
<template>
  <div v-if="show" :class="alertClasses" role="alert">
    <div class="flex">
      <div class="flex-shrink-0">
        <i :class="iconClasses"></i>
      </div>
      <div class="ml-3">
        <h3 v-if="title" class="text-sm font-medium" :class="titleClasses">
          {{ title }}
        </h3>
        <div class="text-sm" :class="messageClasses">
          <slot>{{ message }}</slot>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
          @click="$emit('close')"
          class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          :class="closeButtonClasses"
        >
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  show?: boolean;
  type?: "info" | "success" | "warning" | "error";
  title?: string;
  message?: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  type: "info",
  dismissible: false,
});

const emit = defineEmits<{
  close: [];
}>();

const alertClasses = computed(() => {
  const baseClasses = "rounded-md p-4";

  const types = {
    info: "bg-blue-50 border border-blue-200",
    success: "bg-green-50 border border-green-200",
    warning: "bg-yellow-50 border border-yellow-200",
    error: "bg-red-50 border border-red-200",
  };

  return `${baseClasses} ${types[props.type]}`;
});

const iconClasses = computed(() => {
  const baseClasses = "h-5 w-5";

  const types = {
    info: "mdi mdi-information text-blue-400",
    success: "mdi mdi-check-circle text-green-400",
    warning: "mdi mdi-alert-triangle text-yellow-400",
    error: "mdi mdi-alert-circle text-red-400",
  };

  return `${baseClasses} ${types[props.type]}`;
});

const titleClasses = computed(() => {
  const types = {
    info: "text-blue-800",
    success: "text-green-800",
    warning: "text-yellow-800",
    error: "text-red-800",
  };

  return types[props.type];
});

const messageClasses = computed(() => {
  const types = {
    info: "text-blue-700",
    success: "text-green-700",
    warning: "text-yellow-700",
    error: "text-red-700",
  };

  return types[props.type];
});

const closeButtonClasses = computed(() => {
  const types = {
    info: "text-blue-400 hover:text-blue-600 focus:ring-blue-500",
    success: "text-green-400 hover:text-green-600 focus:ring-green-500",
    warning: "text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500",
    error: "text-red-400 hover:text-red-600 focus:ring-red-500",
  };

  return types[props.type];
});
</script>
