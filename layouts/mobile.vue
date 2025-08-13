<template>
  <div class="mobile-layout muay-thai-layout">
    <!-- Main Content -->
    <main class="mobile-content">
      <slot />
    </main>

    <!-- Enhanced Bottom Navigation -->
    <BottomNavigation
      :activeTab="getCurrentTab()"
      @tab-changed="handleTabChange"
      @scan-requested="handleScanRequest"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BottomNavigation from "@/components/Mobile/BottomNavigation.vue";

const route = useRoute();
const router = useRouter();

// Determine current active tab based on route
const getCurrentTab = () => {
  const path = route.path;

  if (path === "/mobile" || path === "/mobile/") return "home";
  if (path.includes("/book-tickets")) return "book";
  if (path.includes("/statistics")) return "stats";
  if (path.includes("/scan-history")) return "history";
  if (path.includes("/scanner")) return "scan";

  return "home";
};

// Handle tab changes
const handleTabChange = (tab) => {
  // Tab changes are handled by the navigation component itself
  console.log("Tab changed to:", tab);
};

// Handle scan requests
const handleScanRequest = () => {
  console.log("Scan requested from navigation");
};
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

.mobile-layout {
  min-height: 100vh;
  background: var(--dark-bg);
  display: flex;
  flex-direction: column;
}

.mobile-content {
  flex: 1;
  position: relative;
  z-index: 1;
  padding-bottom: 100px; /* Space for bottom navigation */
}

/* Mobile-first responsive design */
@media (max-width: 480px) {
  .mobile-content {
    padding-bottom: 90px;
  }
}

@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-content {
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }
}
</style>
