<template>
  <nav class="bottom-navigation muay-thai-nav">
    <!-- Navigation Background -->
    <div class="nav-background">
      <div class="nav-glow"></div>
      <div class="arena-pattern"></div>
    </div>

    <!-- Navigation Items -->
    <div class="nav-container">
      <!-- Home Tab -->
      <NuxtLink
        to="/mobile"
        class="nav-item"
        :class="{ active: $route.path === '/mobile' }"
        @click="selectTab('home')"
      >
        <div class="nav-icon-wrapper">
          <Icon icon="mdi:home-variant" class="nav-icon" />
          <div class="nav-glow-effect"></div>
        </div>
        <span class="nav-label combat-text">HOME</span>
      </NuxtLink>

      <!-- Book Tickets Tab -->
      <NuxtLink
        to="/mobile/book-tickets"
        class="nav-item"
        :class="{ active: $route.path.includes('/book-tickets') }"
        @click="selectTab('book')"
      >
        <div class="nav-icon-wrapper">
          <Icon icon="mdi:ticket" class="nav-icon" />
          <div class="nav-glow-effect"></div>
        </div>
        <span class="nav-label combat-text">BOOK</span>
      </NuxtLink>

      <!-- CENTER SCAN BUTTON -->
      <button
        class="scan-center-btn combat-scan-btn"
        @click="handleScanClick"
        :disabled="isScanning"
      >
        <div class="scan-btn-background">
          <div class="scan-pulse-ring"></div>
          <div class="scan-pulse-ring delay-1"></div>
          <div class="scan-pulse-ring delay-2"></div>
        </div>

        <div class="scan-icon-container">
          <Icon v-if="!isScanning" icon="mdi:qrcode-scan" class="scan-icon" />
          <div v-else class="scan-loading">
            <div class="combat-spinner"></div>
          </div>
        </div>

        <span class="scan-label combat-text">SCAN</span>

        <!-- Fire effects -->
        <div class="fire-effect fire-1">
          <Icon icon="mdi:fire" class="fire-icon" />
        </div>
        <div class="fire-effect fire-2">
          <Icon icon="mdi:fire" class="fire-icon" />
        </div>
      </button>

      <!-- Statistics Tab -->
      <NuxtLink
        to="/mobile/statistics"
        class="nav-item"
        :class="{ active: $route.path === '/mobile/statistics' }"
        @click="selectTab('stats')"
      >
        <div class="nav-icon-wrapper">
          <Icon icon="mdi:chart-line" class="nav-icon" />
          <div class="nav-glow-effect"></div>
          <div v-if="newStatsAvailable" class="notification-dot"></div>
        </div>
        <span class="nav-label combat-text">STATS</span>
      </NuxtLink>

      <!-- History Tab -->
      <NuxtLink
        to="/mobile/scan-history"
        class="nav-item"
        :class="{ active: $route.path === '/mobile/scan-history' }"
        @click="selectTab('history')"
      >
        <div class="nav-icon-wrapper">
          <Icon icon="mdi:history" class="nav-icon" />
          <div class="nav-glow-effect"></div>
          <div v-if="recentScansCount > 0" class="stats-badge">
            {{ recentScansCount }}
          </div>
        </div>
        <span class="nav-label combat-text">HISTORY</span>
      </NuxtLink>
    </div>

    <!-- Safe Area Bottom -->
    <div class="safe-area-bottom"></div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useQRScannerStore } from "@/stores/qrScanner";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

// Composables
const qrStore = useQRScannerStore();
const authStore = useAuthStore();
const router = useRouter();

// Props
const props = defineProps({
  activeTab: {
    type: String,
    default: "home",
  },
});

// Emits
const emit = defineEmits(["scan-requested", "tab-changed"]);

// State
const isScanning = ref(false);
const selectedTab = ref(props.activeTab);

// Computed
const recentScansCount = computed(() => {
  return qrStore.todayScans?.length || 0;
});

const newStatsAvailable = computed(() => {
  // Check if there are new stats since last visit
  return qrStore.stats?.todayScans > 0;
});

// Methods
const handleScanClick = async () => {
  if (!authStore.isAuthenticated) {
    await router.push("/mobile/login");
    return;
  }

  try {
    isScanning.value = true;

    // Vibration feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }

    // Navigate to scanner
    await router.push("/mobile/scanner");

    // Emit scan requested event
    emit("scan-requested");

    // Play sound feedback
    playScanSound();
  } catch (error) {
    console.error("Scan navigation failed:", error);
  } finally {
    setTimeout(() => {
      isScanning.value = false;
    }, 1000);
  }
};

const selectTab = (tab) => {
  selectedTab.value = tab;
  emit("tab-changed", tab);

  // Haptic feedback
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};

const playScanSound = () => {
  try {
    const audio = new Audio("/sounds/scan-ready.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignore audio errors
    });
  } catch (error) {
    // Ignore audio errors
  }
};

// Lifecycle
onMounted(() => {
  // Initialize scanner store
  qrStore.initializeDevice();
});
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Bottom Navigation */
.bottom-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: transparent;
}

.nav-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 0, 0, 0.8) 20%,
    rgba(0, 0, 0, 0.95) 100%
  );
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.nav-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--primary-red) 20%,
    var(--primary-gold) 50%,
    var(--primary-red) 80%,
    transparent 100%
  );
  animation: navGlow 3s ease-in-out infinite alternate;
}

@keyframes navGlow {
  0% {
    opacity: 0.5;
    transform: scaleX(0.8);
  }
  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

.arena-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 50%,
      rgba(225, 6, 0, 0.1) 0%,
      transparent 30%
    ),
    radial-gradient(
      circle at 80% 50%,
      rgba(255, 215, 0, 0.1) 0%,
      transparent 30%
    );
  opacity: 0.6;
}

/* Navigation Container */
.nav-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 0.5rem 0.5rem;
  height: 80px;
}

/* Navigation Items */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 60px;
}

.nav-item.active {
  color: var(--primary-gold);
  transform: translateY(-2px);
}

.nav-item.active .nav-glow-effect {
  opacity: 1;
  transform: scale(1);
}

.nav-item:not(.active):hover {
  color: rgba(255, 255, 255, 0.8);
  transform: translateY(-1px);
}

/* Navigation Icons */
.nav-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.nav-icon {
  font-size: 1.5rem;
  transition: all 0.3s ease;
  z-index: 2;
}

.nav-glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: radial-gradient(
    circle,
    rgba(255, 215, 0, 0.3) 0%,
    transparent 70%
  );
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  transition: all 0.3s ease;
}

/* Navigation Labels */
.nav-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

/* Notification Elements */
.notification-dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--primary-red);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.stats-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--primary-red);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
  line-height: 1;
}

/* CENTER SCAN BUTTON */
.scan-center-btn {
  position: relative;
  width: 70px;
  height: 70px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin-top: -20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.scan-center-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
}

.scan-center-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}

.scan-center-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Scan Button Background */
.scan-btn-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%);
  border: 3px solid var(--primary-gold);
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(225, 6, 0, 0.6), 0 0 60px rgba(225, 6, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 0, 0, 0.3);
}

/* Pulse Rings */
.scan-pulse-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 80px;
  height: 80px;
  border: 2px solid var(--primary-red);
  border-radius: 50%;
  opacity: 0;
  animation: scanPulse 2s ease-out infinite;
}

.scan-pulse-ring.delay-1 {
  animation-delay: 0.7s;
}

.scan-pulse-ring.delay-2 {
  animation-delay: 1.4s;
}

@keyframes scanPulse {
  0% {
    opacity: 1;
    transform: scale(0.8);
  }
  100% {
    opacity: 0;
    transform: scale(1.5);
  }
}

/* Scan Icon Container */
.scan-icon-container {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
}

.scan-icon {
  font-size: 1.8rem;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.scan-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.combat-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Scan Label */
.scan-label {
  position: absolute;
  bottom: -18px;
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--primary-gold);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
}

/* Fire Effects */
.fire-effect {
  position: absolute;
  z-index: 1;
  opacity: 0;
  animation: fireFlicker 1.5s ease-in-out infinite alternate;
}

.fire-effect.fire-1 {
  top: -8px;
  left: -8px;
  animation-delay: 0s;
}

.fire-effect.fire-2 {
  top: -8px;
  right: -8px;
  animation-delay: 0.5s;
}

.fire-icon {
  font-size: 1rem;
  color: var(--primary-gold);
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.8));
}

@keyframes fireFlicker {
  0% {
    opacity: 0.3;
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.1) rotate(5deg);
  }
}

/* Safe Area */
.safe-area-bottom {
  height: env(safe-area-inset-bottom);
  background: rgba(0, 0, 0, 0.95);
}

/* Pulse Animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Responsive Design */
@media (max-width: 375px) {
  .nav-container {
    padding: 0.75rem 0.25rem 0.5rem;
    height: 75px;
  }

  .scan-center-btn {
    width: 65px;
    height: 65px;
    margin-top: -18px;
  }

  .scan-btn-background {
    width: 55px;
    height: 55px;
  }

  .nav-item {
    min-width: 50px;
    padding: 0.25rem;
  }

  .nav-icon {
    font-size: 1.3rem;
  }

  .nav-label {
    font-size: 0.6rem;
  }
}

@media (min-width: 768px) {
  .nav-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 1.2rem 1rem 0.75rem;
  }

  .scan-center-btn {
    width: 80px;
    height: 80px;
    margin-top: -25px;
  }

  .scan-btn-background {
    width: 70px;
    height: 70px;
  }

  .scan-icon {
    font-size: 2rem;
  }
}
</style>
