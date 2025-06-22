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
        <span class="text-base md:text-xl font-bold tracking-wide">
          <span class="text-white">PATONG</span>
          <span class="text-green-400">BOXING</span>
        </span>
      </div>

      <!-- Desktop Menu -->
      <div v-if="isDesktop" class="flex items-center gap-6">
        <ul class="flex gap-6 text-sm md:text-base font-medium">
          <li>
            <a href="/" class="hover:text-red-400">{{ t("home") }}</a>
          </li>
          <li>
            <a href="/contacts" class="hover:text-red-400">{{
              t("contact")
            }}</a>
          </li>
          <li v-if="!auth?.user">
            <a href="/login" class="hover:text-red-400">เข้าสู่ระบบ</a>
          </li>
          <li v-if="auth?.user?.role === 'admin'">
            <a href="/admin/dashboard" class="hover:text-red-400">หน้าแอดมิน</a>
          </li>
        </ul>

        <div class="flex gap-3">
          <button
            v-if="auth?.user"
            @click="logout"
            class="px-3 py-1 text-xs md:text-sm border rounded hover:bg-white hover:text-black transition"
          >
            ออกจากระบบ
          </button>
          <button
            @click="toggleLang"
            class="px-3 py-1 text-xs md:text-sm border rounded hover:bg-white hover:text-black transition"
          >
            {{ locale === "th" ? "EN" : "TH" }}
          </button>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
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
        class="md:hidden px-6 py-6 bg-[#0a172e]/95 backdrop-blur-md shadow-2xl rounded-b-xl border-t border-white/10"
      >
        <!-- เมนูหลัก -->
        <ul class="flex flex-col gap-4 text-base font-medium text-white">
          <li>
            <a
              href="/"
              class="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i class="mdi mdi-home-outline text-lg"></i> หน้าหลัก
            </a>
          </li>
          <li>
            <a
              href="/contacts"
              class="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i class="mdi mdi-email-outline text-lg"></i> ติดต่อเรา
            </a>
          </li>
          <li v-if="auth?.user?.role === 'admin'">
            <a
              href="/admin/dashboard"
              class="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i class="mdi mdi-shield-account-outline text-lg"></i> หน้าแอดมิน
            </a>
          </li>
          <li v-if="!auth?.user">
            <a
              href="/login"
              class="flex items-center gap-3 hover:text-blue-400 transition"
            >
              <i class="mdi mdi-login-variant text-lg"></i> เข้าสู่ระบบ
            </a>
          </li>
        </ul>

        <!-- ปุ่มล่าง -->
        <div class="mt-6 flex flex-col gap-3">
          <button
            v-if="auth?.user"
            @click="logout"
            class="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border border-white/20 text-white hover:bg-white hover:text-black transition"
          >
            <i class="mdi mdi-logout-variant text-base"></i> ออกจากระบบ
          </button>

          <button
            @click="toggleLang"
            class="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md border border-white/20 text-white hover:bg-white hover:text-black transition"
          >
            <i class="mdi mdi-translate text-base"></i>
            {{ locale === "th" ? "EN" : "TH" }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const { locale, t, setLocale } = useI18n();
const auth = useAuthStore();

const isOpen = ref(false);
const isDesktop = ref(false);

const toggleLang = () => {
  setLocale(locale.value === "th" ? "en" : "th");
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  auth.logout(); // สมมุติคุณมีฟังก์ชันนี้ใน store
  window.location.href = "/login";
};

const updateScreen = () => {
  isDesktop.value = window.innerWidth >= 768;
};

onMounted(() => {
  auth.loadUser();
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
