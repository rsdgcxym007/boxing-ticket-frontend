<template>
  <nav
    class="bg-gray-900 backdrop-blur text-white px-4 py-3 shadow-md sticky top-0 z-50"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img
          src="/images/logo/LOGOFC.svg"
          alt="Patong Boxing Logo"
          class="w-8 h-8 md:w-10 md:h-10"
        />
        <span class="text-lg md:text-xl font-bold tracking-wide">
          <span class="text-white">PATONG</span
          ><span class="text-green-400">BOXING</span>
        </span>
      </div>

      <!-- Desktop Menu -->
      <div v-if="isDesktop" class="flex items-center gap-8">
        <ul class="flex gap-6 text-sm font-medium">
          <li>
            <a href="/" class="hover:text-red-400">{{ t("home") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("stadium") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("training") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("contact") }}</a>
          </li>
        </ul>
        <button
          @click="toggleLang"
          class="px-3 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
        >
          {{ locale === "th" ? "EN" : "TH" }}
        </button>
      </div>

      <!-- Mobile Button -->
      <button class="md:hidden" @click="isOpen = !isOpen">
        <svg
          v-if="!isOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide-fade">
      <div
        v-if="isOpen"
        class="md:hidden px-6 py-6 bg-black/90 backdrop-blur border-t border-white/10 shadow-lg"
      >
        <ul class="flex flex-col gap-4 text-sm font-medium">
          <li>
            <a href="/" class="hover:text-red-400">{{ t("home") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("stadium") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("training") }}</a>
          </li>
          <li>
            <a href="#" class="hover:text-red-400">{{ t("contact") }}</a>
          </li>
        </ul>
        <button
          @click="toggleLang"
          class="mt-4 px-3 py-1 border rounded text-xs hover:bg-white hover:text-black transition"
        >
          {{ locale === "th" ? "EN" : "TH" }}
        </button>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
const { locale, t, setLocale } = useI18n();

const isOpen = ref(false);
const isDesktop = ref(false);

const toggleLang = () => {
  setLocale(locale.value === "th" ? "en" : "th");
};

const updateScreen = () => {
  isDesktop.value = window.innerWidth >= 768;
};
onMounted(() => {
  updateScreen();
  window.addEventListener("resize", updateScreen);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScreen);
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
