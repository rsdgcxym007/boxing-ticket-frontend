<template>
  <section
    class="relative w-full bg-gradient-to-b from-black via-zinc-900 to-black overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <img
        src="/images/stadium.jpg"
        alt="Boxing Ring"
        class="w-full h-full object-cover opacity-20 blur-sm scale-105"
      />
    </div>

    <!-- Content Wrapper -->
    <div
      class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
    >
      <!-- Info Left -->
      <div
        class="bg-gradient-to-br from-orange-500 via-red-500 to-yellow-400 text-white shadow-2xl rounded-3xl p-8 sm:p-10 space-y-6 border border-white/10 animate-fade-in-down"
      >
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wider leading-snug uppercase flex flex-wrap gap-x-2"
        >
          <span class="text-white drop-shadow-md">PATONG</span>
          <span class="text-pink-100">BOXING</span>
          <span class="text-yellow-200 drop-shadow-md">STADIUM</span>
        </h1>

        <p class="text-sm sm:text-base font-medium text-white/90">
          {{ $t("hero.subtitle") }}
        </p>
        <p class="text-xs sm:text-sm font-semibold text-white">
          {{ $t("hero.dateLabel") }}:
          <span class="underline decoration-dotted decoration-white"
            >5th January 2024</span
          >
        </p>

        <div class="flex flex-wrap gap-3 pt-4">
          <div
            v-for="(value, label) in countdown"
            :key="label"
            class="bg-white/90 text-black px-4 py-2 sm:px-5 sm:py-3 rounded-xl shadow text-center w-20"
          >
            <div class="text-xl sm:text-2xl font-bold leading-none">
              {{ value }}
            </div>
            <div
              class="text-[10px] sm:text-xs mt-1 font-semibold uppercase tracking-wide text-gray-600"
            >
              {{ $t(`hero.${label}`) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Info Right -->
      <div
        class="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 sm:p-10 animate-fade-in-up border border-black/10"
      >
        <h2
          class="text-lg sm:text-xl font-bold border-b pb-3 border-gray-300 text-gray-900"
        >
          {{ $t("hero.dayTitle") }}
        </h2>
        <p class="text-sm sm:text-base mt-4 text-gray-800 leading-relaxed">
          {{ $t("hero.dayInfo") }}
        </p>
        <p class="text-xs sm:text-sm mt-2 text-gray-600">
          {{ $t("hero.time") }}
        </p>

        <p class="mt-5 text-xs sm:text-sm font-semibold text-gray-800">
          {{ $t("hero.price") }}:
          <span class="text-red-600 font-bold">{{ $t("hero.ringside") }}</span>
        </p>
        <p class="text-xs sm:text-sm text-gray-700">{{ $t("hero.stadium") }}</p>

        <p class="mt-4 text-xs sm:text-sm text-gray-600">
          {{ $t("hero.door") }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const countdown = ref({ hour: "00", min: "00", sec: "00" });
let timer;

const updateCountdown = () => {
  const now = new Date();
  const nextTarget = new Date();
  nextTarget.setHours(21, 0, 0, 0);
  if (now > nextTarget) {
    nextTarget.setDate(nextTarget.getDate() + 1);
  }

  const diff = nextTarget - now;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdown.value = {
    hour: String(hours).padStart(2, "0"),
    min: String(minutes).padStart(2, "0"),
    sec: String(seconds).padStart(2, "0"),
  };
};

onMounted(() => {
  updateCountdown();
  timer = setInterval(updateCountdown, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});
</script>

<style scoped>
@keyframes fade-in-down {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 1s ease-out;
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}
</style>
