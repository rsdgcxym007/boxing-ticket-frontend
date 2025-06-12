<template>
  <section class="relative w-full h-[50vh] overflow-hidden bg-black">
    <!-- Video Background -->
    <video
      ref="videoEl"
      autoplay
      muted
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/videos/boxing-intro.mp4" type="video/mp4" />
    </video>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";

const videoEl = ref(null);

onMounted(() => {
  if (videoEl.value) {
    videoEl.value.play().catch(() => {
      console.warn("Autoplay prevented by browser");
    });
  }
});
</script>
