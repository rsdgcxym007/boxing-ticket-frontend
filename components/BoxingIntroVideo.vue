<template>
  <section class="relative w-full h-[100vh] overflow-hidden bg-black">
    <!-- Video Background -->
    <video
      ref="videoEl"
      autoplay
      muted
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/LUDEPATONGBOXINGlast.mp4" type="video/mp4" />
    </video>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const videoEl = ref(null);

onMounted(() => {
  if (videoEl.value) {
    videoEl.value.play().catch(() => {});
  }
});
</script>
