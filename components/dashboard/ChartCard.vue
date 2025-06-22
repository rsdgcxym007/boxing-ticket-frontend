<template>
  <div
    class="bg-[#13294b] rounded-2xl shadow-lg p-6 transition-all duration-200 ease-out hover:scale-[1.015]"
  >
    <h3 class="font-semibold mb-4">{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>
