<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
  >
    <BaseSpinner :size="size" :color="color" :text="text" />
  </div>
</template>

<script setup lang="ts">
import BaseSpinner from "./base/BaseSpinner.vue";

interface Props {
  visible: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  text?: string;
}

withDefaults(defineProps<Props>(), {
  size: "lg",
  color: "primary",
});
</script>
