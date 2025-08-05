<template>
  <nav
    class="bg-gray-900 backdrop-blur text-white px-4 py-3 shadow-md sticky top-0 z-50"
  >
    <div class="flex items-center justify-between max-w-7xl mx-auto">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <img
          :src="getImagePath('/images/logo/LOGOFC.svg')"
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
            <NuxtLink to="/" class="hover:text-green-400">{{
              t("home")
            }}</NuxtLink>
          </li>
          <li>
            <NuxtLink
              :to="localePath('/StandingTicketForm')"
              class="hover:text-green-400"
              >{{ t("stadiumTicket") }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="localePath('/ringside')"
              class="hover:text-green-400"
              >{{ t("ringsideTicket") }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="localePath('/contacts')"
              class="hover:text-green-400"
              >{{ t("contact") }}</NuxtLink
            >
          </li>
          <li v-if="!auth?.user">
            <NuxtLink :to="localePath('/login')" class="hover:text-green-400">{{
              t("login") || "เข้าสู่ระบบ"
            }}</NuxtLink>
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
              <Icon icon="mdi:shield-account-outline" class="text-lg" />
              {{
                ["admin"].includes(auth?.user?.role)
                  ? "หน้าแอดมิน"
                  : "หน้าเจ้าหน้าที่"
              }}
              <Icon icon="mdi:chevron-down" class="w-4 h-4 mt-0.5" />
            </button>

            <!-- Admin Dropdown Menu -->
            <div
              v-if="adminMenuHover || adminMenuOpen"
              ref="adminDropdownMenuRef"
              tabindex="-1"
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
                :to="localePath(item.to)"
                class="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/10 transition rounded-md"
                @click="closeAdminMenu"
              >
                <Icon
                  :icon="item.icon.replace('mdi-', 'mdi:')"
                  class="text-lg text-white/80"
                />
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
        <NuxtLink
          :to="localePath('/StandingTicketForm')"
          class="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
        >
          ซื้อตั๋วยืน
        </NuxtLink>
        <NuxtLink
          :to="localePath('/ringside')"
          class="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white hover:text-black transition"
        >
          ซื้อตั๋วริงไซด์
        </NuxtLink>

        <!-- Hamburger Icon -->
        <button @click="isOpen = !isOpen">
          <Icon v-if="!isOpen" icon="mdi:menu" class="w-6 h-6 text-white" />
          <Icon v-else icon="mdi:close" class="w-6 h-6 text-white" />
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
            <NuxtLink
              :to="localePath('/')"
              class="flex items-center gap-3 hover:text-blue-400"
              @click="isOpen = false"
              ><Icon
                icon="mdi:home-outline"
                class="text-xl"
              />หน้าหลัก</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="localePath('/StandingTicketForm')"
              class="flex items-center gap-3 hover:text-blue-400"
              @click="isOpen = false"
              @click.prevent="
                handleMobileNav(localePath('/StandingTicketForm'))
              "
              ><Icon icon="mdi:ticket-outline" class="text-xl" />
              ซื้อตั๋วยืน</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="localePath('/ringside')"
              class="flex items-center gap-3 hover:text-blue-400"
              @click="isOpen = false"
              @click.prevent="handleMobileNav(localePath('/ringside'))"
              ><Icon icon="mdi:crown-outline" class="text-xl" />
              ซื้อตั๋วริงไซด์</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              :to="localePath('/contacts')"
              @click.prevent="handleMobileNav(localePath('/contacts'))"
              class="flex items-center gap-3 hover:text-blue-400"
              @click="isOpen = false"
              ><Icon
                icon="mdi:email-outline"
                class="text-xl"
              />ติดต่อเรา</NuxtLink
            >
          </li>
          <li v-if="!auth?.user">
            <NuxtLink
              :to="localePath('/login')"
              @click.prevent="handleMobileNav(localePath('/login'))"
              class="flex items-center gap-3 hover:text-blue-400"
              @click="isOpen = false"
              ><Icon icon="mdi:login-variant" class="text-xl" />
              >เข้าสู่ระบบ</NuxtLink
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
              <Icon icon="mdi:shield-account-outline" class="text-xl" />
              {{
                ["admin"].includes(auth?.user?.role)
                  ? "หน้าแอดมิน"
                  : "หน้าเจ้าหน้าที่"
              }}
              <Icon
                :icon="adminSubOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              />
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
                    :to="localePath(item.to)"
                    class="flex items-center gap-2 hover:text-white"
                    @click="
                      adminSubOpen = false;
                      isOpen = false;
                    "
                  >
                    <Icon :icon="item.icon.replace('mdi-', 'mdi:')" />
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
            @click="handleLogout"
            class="flex items-center gap-3 px-4 py-2 rounded-md border border-white/10 hover:bg-white hover:text-black"
          >
            <Icon icon="mdi:logout-variant" class="text-xl" /> ออกจากระบบ
          </button>

          <button
            @click="handleToggleLang"
            class="flex items-center gap-3 px-4 py-2 rounded-md border border-white/10 hover:bg-white hover:text-black"
          >
            <Icon icon="mdi:translate" class="text-xl" />
            {{ locale === "th" ? "English" : "ไทย" }}
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useAdminMenu } from "@/composables/useAdminMenu";
import { useImagePath } from "@/composables/useImagePath";
import { useRouter } from "vue-router";
import { useSwitchLocalePath, useLocalePath } from "#imports";
import { authDebug } from "@/utils/authDebug";

const { getImagePath } = useImagePath();
const { locale, t } = useI18n();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();
const localePath = useLocalePath();
const auth = useAuthStore();

const isOpen = ref(false);
const isDesktop = ref(false);
const adminMenu = useAdminMenu();
const adminMenuOpen = ref(false);
const adminMenuHover = ref(false);
const adminSubOpen = ref(false);
const adminDropdownMenuRef = ref(null);
// ปิด dropdown เมื่อคลิกนอกเมนู
onClickOutside(adminDropdownMenuRef, () => {
  if (adminMenuOpen.value) adminMenuOpen.value = false;
});

// ปิด dropdown เมื่อเปลี่ยน route
watch(
  () => router.currentRoute.value.fullPath,
  () => {
    adminMenuOpen.value = false;
    adminMenuHover.value = false;
  }
);

const toggleAdminMenu = () => {
  adminMenuOpen.value = !adminMenuOpen.value;
};

const closeAdminMenu = () => {
  adminMenuOpen.value = false;
  adminMenuHover.value = false;
};

const handleMobileNav = async (path) => {
  await router.push(path);
  isOpen.value = false;
};
const handleLogout = async () => {
  await logout();
  isOpen.value = false;
};

const handleToggleLang = async () => {
  await toggleLang();
  isOpen.value = false;
};
const toggleLang = () => {
  const newLocale = locale.value === "th" ? "en" : "th";
  const path = switchLocalePath(newLocale);
  router.push(path);
};
const logout = async () => {
  console.log("🚪 Starting logout process...");
  authDebug.logAuthState();

  // Clear authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  auth.logout();

  console.log("🧹 After logout call, auth data cleared");
  authDebug.logAuthState();

  // Navigate to login with proper locale
  await router.push(localePath("/login"));

  // Force reload to ensure clean state
  await nextTick();
  console.log("🔄 Reloading page for clean state");
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
