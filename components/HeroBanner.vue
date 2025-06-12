<template>
  <section class="w-full bg-[#0f172a] py-4">
    <div
      class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
    >
      <!-- Hero Left: Responsive heading + countdown + info -->
      <div
        class="bg-[#0b1b3f] rounded-3xl shadow-2xl px-10 py-12 text-left text-white"
      >
        <h1
          class="text-3xl sm:text-4xl md:text-5xl font-bold uppercase leading-snug tracking-wide flex flex-wrap gap-x-2 gap-y-1"
        >
          <span class="text-yellow-400">PATONG</span>
          <span class="text-yellow-300">BOXING</span>
          <span class="text-yellow-100">STADIUM</span>
        </h1>

        <p class="mt-4 text-sm sm:text-base text-white/90 font-medium">
          {{ $t("hero.subtitle") }}
        </p>

        <p class="text-xs sm:text-sm font-semibold mt-2">
          {{ $t("hero.dateLabel") }}:
          <span class="underline decoration-dotted decoration-white"
            >5th January 2024</span
          >
        </p>

        <!-- Countdown Timer -->
        <div class="flex gap-3 pt-4">
          <div
            v-for="(value, label) in countdown"
            :key="label"
            class="bg-white text-black px-4 py-2 sm:px-5 sm:py-3 rounded-xl text-center w-20 shadow"
          >
            <div class="text-xl sm:text-2xl font-bold">{{ value }}</div>
            <div
              class="text-[10px] sm:text-xs mt-1 font-semibold uppercase tracking-wide text-gray-600"
            >
              {{ $t(`hero.${label}`) }}
            </div>
          </div>
        </div>

        <!-- Info Block -->
        <h2
          class="text-lg sm:text-xl font-bold border-b pb-3 border-gray-300 text-white mt-8"
        >
          {{ $t("hero.dayTitle") }}
        </h2>

        <p class="text-sm sm:text-base mt-4 text-white/90 leading-relaxed">
          {{ $t("hero.dayInfo") }}
        </p>
        <p class="text-xs sm:text-sm mt-2 text-slate-300">
          {{ $t("hero.time") }}
        </p>

        <p class="mt-5 text-xs sm:text-sm font-semibold text-white">
          {{ $t("hero.price") }}:
          <span class="text-red-400 font-bold">{{ $t("hero.ringside") }}</span>
        </p>
        <p class="text-xs sm:text-sm text-slate-300">
          {{ $t("hero.stadium") }}
        </p>

        <p class="mt-4 text-xs sm:text-sm text-slate-300">
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
