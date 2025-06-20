<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center"
  >
    <div
      class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"
    />
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean,
});
</script>
