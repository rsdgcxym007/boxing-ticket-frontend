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
      <div v-if="isDesktop" class="flex items-center gap-8">
        <ul class="flex gap-8 text-sm md:text-base font-semibold tracking-wide">
          <li>
            <router-link to="/" class="hover:text-green-400">{{
              t("home")
            }}</router-link>
          </li>
          <li>
            <router-link
              to="/StandingTicketForm"
              class="hover:text-green-400"
              >{{ t("stadiumTicket") }}</router-link
            >
          </li>
          <li>
            <router-link to="/ringside" class="hover:text-green-400">{{
              t("ringsideTicket")
            }}</router-link>
          </li>
          <li>
            <router-link to="/contacts" class="hover:text-green-400">{{
              t("contact")
            }}</router-link>
          </li>
          <li v-if="!auth?.user">
            <router-link to="/login" class="hover:text-green-400">{{
              t("login") || "เข้าสู่ระบบ"
            }}</router-link>
          </li>
          <!-- Admin Dropdown -->
          <li
            v-if="['admin', 'staff'].includes(auth?.user?.role)"
            class="relative group"
          >
            <button
              @click="toggleAdminMenu"
              @touchstart="adminMenuHover = true"
              @mouseenter="adminMenuHover = true"
              @mouseleave="adminMenuHover = false"
              class="hover:text-green-400 flex items-center gap-1"
            >
              <i class="mdi mdi-shield-account-outline text-lg"></i>
              {{
                ["admin"].includes(auth?.user?.role)
                  ? "หน้าแอดมิน"
                  : "หน้าเจ้าหน้าที่"
              }}
              <svg
                class="w-4 h-4 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.587l3.71-4.356a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>

            <!-- Admin Dropdown Menu -->
            <div
              v-if="adminMenuHover || adminMenuOpen"
              @touchstart="adminMenuHover = true"
              @mouseenter="adminMenuHover = true"
              @mouseleave="adminMenuHover = false"
              class="absolute top-full left-0 mt-2 w-56 bg-[#0f1f3c] text-white shadow-xl rounded-xl z-50 py-2 border border-white/10"
            >
              <router-link
                v-for="item in adminMenu.filter(
                  (i) => !i.role || i.role.includes(auth?.user?.role)
                )"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition rounded-md"
              >
                <i :class="`mdi ${item.icon} text-lg text-white/80`"></i>
                <span>{{ item.label }}</span>
              </router-link>
            </div>
          </li>
        </ul>

        <!-- Logout & Lang -->
        <div class="flex items-center gap-3">
          <button
            v-if="auth?.user"
            @click="logout"
            class="px-4 py-1.5 text-sm border border-white/30 rounded-md hover:bg-white hover:text-black transition"
          >
            ออกจากระบบ
          </button>
          <button
            @click="toggleLang"
            class="px-4 py-1.5 text-sm border border-white/30 rounded-md hover:bg-white hover:text-black transition"
          >
            {{ locale === "th" ? "EN" : "TH" }}
          </button>
        </div>
      </div>

      <!-- Mobile: Buttons + Hamburger -->
      <div v-if="!isDesktop" class="flex items-center gap-2 md:hidden">
        <!-- Stadium & Ringside Buttons -->
        <a
          href="/StandingTicketForm"
          class="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
        >
          ซื้อตั๋วยืน
        </a>
        <a
          href="/ringside"
          class="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
        >
          ซื้อตั๋วริงไซด์
        </a>

        <!-- Hamburger Icon -->
        <button @click="isOpen = !isOpen">
          <svg
            v-if="!isOpen"
            class="w-6 h-6 text-white"
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
            class="w-6 h-6 text-white"
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
    </div>

    <!-- Mobile Menu Dropdown -->
    <transition name="slide-fade">
      <div
        v-if="isOpen"
        class="md:hidden px-6 py-6 bg-[#0a172e]/95 backdrop-blur-md shadow-2xl rounded-b-xl border-t border-white/10"
      >
        <ul class="flex flex-col gap-3 text-base font-medium text-white">
          <li>
            <router-link
              to="/"
              class="flex items-center gap-3 hover:text-blue-400"
              ><i class="mdi mdi-home-outline text-xl"></i>หน้าหลัก</router-link
            >
          </li>
          <li>
            <router-link
              to="/contacts"
              class="flex items-center gap-3 hover:text-blue-400"
              ><i class="mdi mdi-email-outline text-xl"></i
              >ติดต่อเรา</router-link
            >
          </li>
          <li v-if="!auth?.user">
            <router-link
              to="/login"
              class="flex items-center gap-3 hover:text-blue-400"
              ><i class="mdi mdi-login-variant text-xl"></i
              >เข้าสู่ระบบ</router-link
            >
          </li>

          <!-- Admin Dropdown (Mobile) -->
          <li
            v-if="['admin', 'staff'].includes(auth?.user?.role)"
            class="flex flex-col"
          >
            <button
              @click="adminSubOpen = !adminSubOpen"
              class="flex items-center gap-3 w-full text-left hover:text-blue-400"
            >
              <i class="mdi mdi-shield-account-outline text-xl"></i>
              {{
                ["admin"].includes(auth?.user?.role)
                  ? "หน้าแอดมิน"
                  : "หน้าเจ้าหน้าที่"
              }}
              <i
                class="mdi"
                :class="adminSubOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></i>
            </button>
            <transition name="slide-fade">
              <ul
                v-if="adminSubOpen"
                class="mt-2 ml-6 flex flex-col gap-2 text-sm text-white/80"
              >
                <li
                  v-for="item in adminMenu.filter(
                    (i) => !i.role || i.role.includes(auth?.user?.role)
                  )"
                  :key="item.to"
                >
                  <router-link
                    :to="item.to"
                    class="flex items-center gap-2 hover:text-white"
                  >
                    <i :class="`mdi ${item.icon}`"></i>
                    {{ item.label }}
                  </router-link>
                </li>
              </ul>
            </transition>
          </li>
        </ul>

        <!-- Divider -->
        <div class="border-t border-white/10 my-5"></div>

        <!-- Logout & Language -->
        <div class="flex flex-col gap-3">
          <button
            v-if="auth?.user"
            @click="logout"
            class="flex items-center gap-3 px-4 py-2 rounded-md border border-white/10 hover:bg-white hover:text-black"
          >
            <i class="mdi mdi-logout-variant text-xl"></i> ออกจากระบบ
          </button>
          <button
            @click="toggleLang"
            class="flex items-center gap-3 px-4 py-2 rounded-md border border-white/10 hover:bg-white hover:text-black"
          >
            <i class="mdi mdi-translate text-xl"></i>
            {{ locale === "th" ? "English" : "ไทย" }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useAdminMenu } from "@/composables/useAdminMenu";
import { useRouter } from "vue-router";
import { useSwitchLocalePath } from "#imports";
const { locale, t } = useI18n();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();
const auth = useAuthStore();

const isOpen = ref(false);
const isDesktop = ref(false);
const adminMenu = useAdminMenu();
const adminMenuOpen = ref(false);
const adminMenuHover = ref(false);
const adminSubOpen = ref(false);

const toggleAdminMenu = () => {
  adminMenuOpen.value = !adminMenuOpen.value;
};

const toggleLang = () => {
  const newLocale = locale.value === "th" ? "en" : "th";
  const path = switchLocalePath(newLocale);
  router.push(path);
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

<style>
/* Fade Slide Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.35s ease-out;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes fade-slide {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-slide {
  animation: fade-slide 0.35s ease-out;
}

/* Navbar Modern Look */
nav {
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Dropdown Enhancements */
nav ul li a,
nav ul li button {
  transition: all 0.25s ease-in-out;
  white-space: nowrap;
}

nav ul li a:hover,
nav ul li button:hover {
  transform: scale(1.05);
  color: #34d399;
}

/* Mobile Admin Submenu Styling */
nav .admin-sub ul {
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  padding: 1rem;
}

/* Active Underline Effect */
nav a.relative::after,
nav button.relative::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(to right, #34d399, #60a5fa);
  width: 0%;
  transition: width 0.4s ease-in-out;
}
nav a.relative:hover::after,
nav button.relative:hover::after {
  width: 100%;
}
</style>
