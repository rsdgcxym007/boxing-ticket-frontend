<template>
  <div
    v-if="isElectron"
    class="electron-menu-bar fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
    :class="{ 'pl-20': platform === 'darwin' }"
  >
    <!-- App Title and Version -->
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <img
          :src="getImagePath('/images/logo/LOGOFC.svg')"
          alt="Logo"
          class="w-6 h-6"
        />
        <span class="font-semibold text-sm text-gray-800 dark:text-gray-200">
          Patong Boxing Ticket System
        </span>
        <span
          v-if="appVersion"
          class="text-xs text-gray-500 dark:text-gray-400"
        >
          v{{ appVersion }}
        </span>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex items-center space-x-1">
      <button
        v-for="item in menuItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="nav-btn"
        :class="{ active: $route.path === item.path }"
        :title="item.title"
      >
        <Icon :icon="item.icon" class="w-4 h-4" />
        <span class="ml-1 text-xs">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Right Side Controls -->
    <div class="flex items-center space-x-2">
      <!-- Update Status -->
      <div v-if="updateStatus" class="flex items-center space-x-1">
        <Icon
          :icon="getUpdateIcon()"
          :class="getUpdateIconClass()"
          class="w-4 h-4"
        />
        <span class="text-xs text-gray-600 dark:text-gray-300">
          {{ getUpdateStatusText() }}
        </span>
      </div>

      <!-- Update Progress -->
      <div v-if="updateProgress" class="flex items-center space-x-1">
        <div class="w-16 bg-gray-200 rounded-full h-1">
          <div
            class="bg-blue-600 h-1 rounded-full transition-all duration-300"
            :style="{ width: updateProgress.percent + '%' }"
          ></div>
        </div>
        <span class="text-xs text-gray-600 dark:text-gray-300">
          {{ Math.round(updateProgress.percent) }}%
        </span>
      </div>

      <!-- Quick Actions -->
      <button
        @click="checkForUpdates"
        class="action-btn"
        title="Check for Updates"
      >
        <Icon icon="mdi:update" class="w-4 h-4" />
      </button>

      <!-- Logout Button -->
      <button
        v-if="auth?.user"
        @click="logout"
        class="action-btn"
        title="ออกจากระบบ"
      >
        <Icon icon="mdi:logout" class="w-4 h-4" />
      </button>

      <!-- Window Controls (for Windows/Linux) -->
      <ElectronWindowControls />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useElectron } from "../composables/useElectron";
import { useImagePath } from "../composables/useImagePath";
import { useAuthStore } from "../stores/auth";
import ElectronWindowControls from "./ElectronWindowControls.vue";
import { Icon } from "@iconify/vue";

const { getImagePath } = useImagePath();
const router = useRouter();
const route = useRoute();

const auth = useAuthStore();
// Logout function (same logic as Navbar)
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  auth.logout();
  router.push("/login");
};

const {
  isElectron,
  platform,
  appVersion,
  updateStatus,
  updateProgress,
  checkForUpdates,
  setupMenuListeners,
} = useElectron();

const menuItems = ref([
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: "mdi:view-dashboard",
    title: "Dashboard (Ctrl+1)",
  },
  {
    path: "/admin/orders",
    label: "Orders",
    icon: "mdi:receipt",
    title: "Orders (Ctrl+2)",
  },
  {
    path: "/ringside",
    label: "Ringside",
    icon: "mdi:stadium",
    title: "Ringside Seats (Ctrl+R)",
  },
  {
    path: "/StandingTicketForm",
    label: "Standing",
    icon: "mdi:human-handsup",
    title: "Standing Tickets (Ctrl+S)",
  },
  {
    path: "/admin/staff",
    label: "Staff",
    icon: "mdi:account-group",
    title: "Staff Management (Ctrl+3)",
  },
  {
    path: "/admin/audit",
    label: "Audit",
    icon: "mdi:file-search",
    title: "Audit (Ctrl+4)",
  },
  {
    path: "/admin/referrer",
    label: "Referrer",
    icon: "mdi:account-network",
    title: "Referrer (Ctrl+5)",
  },
]);

const navigateTo = (path: string) => {
  router.push(path);
};

const getUpdateIcon = () => {
  switch (updateStatus.value) {
    case "checking":
      return "mdi:loading";
    case "available":
      return "mdi:download";
    case "downloading":
      return "mdi:download";
    case "downloaded":
      return "mdi:check-circle";
    case "error":
      return "mdi:alert-circle";
    default:
      return "mdi:update";
  }
};

const getUpdateIconClass = () => {
  switch (updateStatus.value) {
    case "checking":
      return "animate-spin text-blue-500";
    case "available":
      return "text-green-500";
    case "downloading":
      return "text-blue-500";
    case "downloaded":
      return "text-green-500";
    case "error":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
};

const getUpdateStatusText = () => {
  switch (updateStatus.value) {
    case "checking":
      return "Checking...";
    case "available":
      return "Update available";
    case "downloading":
      return "Downloading...";
    case "downloaded":
      return "Ready to install";
    case "error":
      return "Update error";
    case "not-available":
      return "Up to date";
    default:
      return "";
  }
};

// Setup menu listeners and add body class when component mounts
onMounted(() => {
  if (isElectron.value) {
    setupMenuListeners(router);
    document.body.classList.add("electron-app");
  }
});
</script>

<style scoped>
.electron-menu-bar {
  -webkit-app-region: drag;
  user-select: none;
  height: 40px;
}

.nav-btn,
.action-btn {
  -webkit-app-region: no-drag;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  color: #6b7280;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-btn:hover,
.action-btn:hover {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
}

.nav-btn.active {
  background: #3b82f6;
  color: white;
}

.dark .nav-btn,
.dark .action-btn {
  color: #9ca3af;
}

.dark .nav-btn:hover,
.dark .action-btn:hover {
  background: rgba(156, 163, 175, 0.1);
  color: #d1d5db;
}

.dark .nav-btn.active {
  background: #2563eb;
  color: white;
}

/* macOS specific styles */
.platform-darwin .electron-menu-bar {
  padding-left: 80px; /* Space for traffic lights */
}

/* Windows specific styles */
.platform-win32 .electron-menu-bar {
  height: 32px;
}

/* Linux specific styles */
.platform-linux .electron-menu-bar {
  height: 28px;
}

/* Animation for loading icon */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
/* Hide the web Navbar when ElectronMenuBar is shown */
</style>
<style>
body.electron-app .navbar,
body.electron-app nav.bg-gray-900 {
  display: none !important;
}
body.electron-app .main-content {
  padding-top: 40px;
}
</style>
