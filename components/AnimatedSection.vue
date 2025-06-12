<template>
  <div
    ref="target"
    :class="[
      'transition-all duration-[3000ms] ease-out',
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const target = ref(null);
const isVisible = ref(false);

useIntersectionObserver(target, ([{ isIntersecting }]) => {
  if (isIntersecting) isVisible.value = true;
});
</script>

<style scoped></style>
