<template>
  <section
    class="relative w-full h-[100vh] overflow-hidden bg-black"
    ref="sectionEl"
  >
    <!-- Video Background -->
    <video
      ref="videoEl"
      autoplay
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
      :muted="isMuted"
    >
      <source src="/videos/LUDEPATONGBOXINGlast.mp4" type="video/mp4" />
    </video>
    <button
      @click="toggleMute"
      class="absolute z-10 bottom-6 right-6 bg-black/60 text-white rounded-full p-3 shadow-lg hover:bg-black/80 transition"
    >
      <i
        :class="isMuted ? 'mdi mdi-volume-off' : 'mdi mdi-volume-high'"
        class="text-2xl"
      ></i>
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const videoEl = ref(null);
const sectionEl = ref(null);
const isMuted = ref(true);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
  if (videoEl.value) {
    videoEl.value.muted = isMuted.value;
  }
};

let hasInteracted = false;
const enableSoundOnFirstInteraction = () => {
  if (!hasInteracted) {
    hasInteracted = true;
    isMuted.value = false;
    if (videoEl.value) {
      videoEl.value.muted = false;
    }
    // remove listeners
    if (sectionEl.value) {
      sectionEl.value.removeEventListener(
        "click",
        enableSoundOnFirstInteraction
      );
      sectionEl.value.removeEventListener(
        "touchstart",
        enableSoundOnFirstInteraction
      );
    }
  }
};

onMounted(() => {
  if (videoEl.value) {
    videoEl.value.muted = isMuted.value;
    videoEl.value.play().catch(() => {});
  }
  if (sectionEl.value) {
    sectionEl.value.addEventListener("click", enableSoundOnFirstInteraction);
    sectionEl.value.addEventListener(
      "touchstart",
      enableSoundOnFirstInteraction
    );
  }
});

onUnmounted(() => {
  if (sectionEl.value) {
    sectionEl.value.removeEventListener("click", enableSoundOnFirstInteraction);
    sectionEl.value.removeEventListener(
      "touchstart",
      enableSoundOnFirstInteraction
    );
  }
});
</script>
