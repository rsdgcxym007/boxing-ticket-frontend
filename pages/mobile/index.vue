<template>
  <div class="muay-thai-arena">
    <!-- Combat Background -->
    <div class="arena-background">
      <div class="ring-lights"></div>
      <div class="fighter-silhouette"></div>
      <div class="arena-smoke"></div>
    </div>

    <!-- Main Arena Content -->
    <div class="arena-content">
      <!-- Arena Header with Fighter Status -->
      <header class="arena-header">
        <div class="fighter-status">
          <div class="fighter-info">
            <div class="fighter-avatar">
              <Icon icon="mdi:account-circle" class="avatar-icon" />
              <div class="status-indicator online"></div>
            </div>
            <div class="fighter-details">
              <h2 class="fighter-name combat-text">
                {{ user?.name || "Fighter" }}
              </h2>
              <p class="fighter-role">{{ getFighterRole(user?.role) }}</p>
            </div>
          </div>

          <div class="arena-controls">
            <!-- Notifications Bell -->
            <button
              class="control-btn notification-btn"
              @click="showNotifications = !showNotifications"
            >
              <Icon icon="mdi:bell" class="control-icon" />
              <div v-if="unreadCount > 0" class="notification-badge">
                {{ unreadCount }}
              </div>
            </button>

            <!-- Fighter Menu -->
            <div class="fighter-menu" :class="{ active: showUserMenu }">
              <button
                class="menu-trigger combat-btn"
                @click="showUserMenu = !showUserMenu"
              >
                <Icon icon="mdi:menu" class="menu-icon" />
              </button>

              <div v-if="showUserMenu" class="menu-dropdown" @click.stop>
                <div class="menu-header">
                  <Icon icon="mdi:crown" class="crown-icon" />
                  <span class="combat-text">FIGHTER MENU</span>
                </div>
                <div class="menu-items">
                  <button class="menu-item" @click="viewProfile">
                    <Icon icon="mdi:account-edit" class="item-icon" />
                    <span>Fighter Profile</span>
                  </button>
                  <button class="menu-item" @click="viewHistory">
                    <Icon icon="mdi:history" class="item-icon" />
                    <span>Battle History</span>
                  </button>
                  <button class="menu-item" @click="viewSettings">
                    <Icon icon="mdi:cog" class="item-icon" />
                    <span>Arena Settings</span>
                  </button>
                  <div class="menu-divider"></div>
                  <button class="menu-item danger" @click="confirmLogout">
                    <Icon icon="mdi:logout" class="item-icon" />
                    <span>Exit Arena</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Arena Title -->
        <div class="arena-title-section">
          <h1 class="arena-main-title combat-text">🥊 PATONG ARENA 🥊</h1>
          <p class="arena-subtitle">COMBAT COMMAND CENTER</p>
          <div class="title-decorations">
            <div class="decoration-line left"></div>
            <Icon icon="mdi:fire" class="center-flame" />
            <div class="decoration-line right"></div>
          </div>
        </div>
      </header>

      <!-- Quick Battle Actions -->
      <section class="quick-actions-section">
        <h3 class="section-title combat-text">
          <Icon icon="mdi:flash" class="section-icon" />
          QUICK BATTLES
        </h3>

        <div class="action-grid">
          <!-- QR Scanner Action -->
          <div class="action-card primary-action">
            <div class="action-header">
              <Icon icon="mdi:qrcode-scan" class="action-icon primary" />
              <h4 class="action-title combat-text">QR SCANNER</h4>
            </div>
            <p class="action-description">
              Scan fighter tickets and validate entries
            </p>
            <button class="action-btn primary" @click="openQRScanner">
              <Icon icon="mdi:camera" class="btn-icon" />
              <span class="combat-text">SCAN NOW</span>
            </button>
          </div>

          <!-- Book Tickets Action -->
          <div class="action-card secondary-action">
            <div class="action-header">
              <Icon icon="mdi:ticket" class="action-icon secondary" />
              <h4 class="action-title combat-text">BOOK FIGHTS</h4>
            </div>
            <p class="action-description">Reserve seats for upcoming battles</p>
            <button class="action-btn secondary" @click="navigateToBooking">
              <Icon icon="mdi:sword-cross" class="btn-icon" />
              <span class="combat-text">BOOK SEATS</span>
            </button>
          </div>

          <!-- Staff Dashboard Action -->
          <div class="action-card tertiary-action" v-if="isStaffOrAdmin">
            <div class="action-header">
              <Icon icon="mdi:shield-crown" class="action-icon tertiary" />
              <h4 class="action-title combat-text">COMMAND CENTER</h4>
            </div>
            <p class="action-description">Access staff management tools</p>
            <button class="action-btn tertiary" @click="navigateToDashboard">
              <Icon icon="mdi:view-dashboard" class="btn-icon" />
              <span class="combat-text">ENTER</span>
            </button>
          </div>

          <!-- Arena Stats Action -->
          <div class="action-card stats-action">
            <div class="action-header">
              <Icon icon="mdi:chart-line" class="action-icon stats" />
              <h4 class="action-title combat-text">ARENA STATS</h4>
            </div>
            <p class="action-description">View live battle statistics</p>
            <button class="action-btn stats" @click="viewStats">
              <Icon icon="mdi:eye" class="btn-icon" />
              <span class="combat-text">VIEW STATS</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Arena Status Dashboard -->
      <section class="arena-status-section">
        <h3 class="section-title combat-text">
          <Icon icon="mdi:stadium" class="section-icon" />
          ARENA STATUS
        </h3>

        <div class="status-grid">
          <!-- Live Fights -->
          <div class="status-card live-fights">
            <div class="status-header">
              <Icon icon="mdi:broadcast" class="status-icon live" />
              <span class="status-label combat-text">LIVE FIGHTS</span>
            </div>
            <div class="status-value">{{ liveStats.activeFights }}</div>
            <div class="status-trend up">
              <Icon icon="mdi:trending-up" />
              <span>Active Now</span>
            </div>
          </div>

          <!-- Tickets Sold -->
          <div class="status-card ticket-sales">
            <div class="status-header">
              <Icon icon="mdi:ticket-confirmation" class="status-icon gold" />
              <span class="status-label combat-text">TICKETS SOLD</span>
            </div>
            <div class="status-value">{{ liveStats.ticketsSold }}</div>
            <div class="status-trend up">
              <Icon icon="mdi:trending-up" />
              <span>+{{ liveStats.todayIncrease }}% Today</span>
            </div>
          </div>

          <!-- Arena Capacity -->
          <div class="status-card capacity">
            <div class="status-header">
              <Icon icon="mdi:account-group" class="status-icon blue" />
              <span class="status-label combat-text">CAPACITY</span>
            </div>
            <div class="status-value">{{ liveStats.capacity }}%</div>
            <div
              class="status-trend"
              :class="liveStats.capacity > 80 ? 'up' : 'neutral'"
            >
              <Icon
                :icon="
                  liveStats.capacity > 80
                    ? 'mdi:trending-up'
                    : 'mdi:trending-neutral'
                "
              />
              <span>{{ getCapacityStatus(liveStats.capacity) }}</span>
            </div>
          </div>

          <!-- Fighter Check-ins -->
          <div class="status-card checkins">
            <div class="status-header">
              <Icon icon="mdi:check-circle" class="status-icon green" />
              <span class="status-label combat-text">CHECK-INS</span>
            </div>
            <div class="status-value">{{ liveStats.checkIns }}</div>
            <div class="status-trend up">
              <Icon icon="mdi:trending-up" />
              <span>Last Hour</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Activity Feed -->
      <section class="activity-section">
        <h3 class="section-title combat-text">
          <Icon icon="mdi:history" class="section-icon" />
          BATTLE LOG
        </h3>

        <div class="activity-feed">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon-wrapper">
              <Icon
                :icon="getActivityIcon(activity.type)"
                class="activity-icon"
              />
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.description }}</p>
              <span class="activity-time">{{
                formatTime(activity.timestamp)
              }}</span>
            </div>
            <div class="activity-status" :class="activity.status">
              {{ activity.status }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Logout Confirmation Modal -->
    <div
      v-if="showLogoutModal"
      class="modal-overlay"
      @click="showLogoutModal = false"
    >
      <div class="combat-modal" @click.stop>
        <div class="modal-header">
          <Icon icon="mdi:logout" class="modal-icon danger" />
          <h3 class="modal-title combat-text">EXIT ARENA?</h3>
        </div>
        <div class="modal-content">
          <p>
            Are you sure you want to leave the arena? Your fighting session will
            end.
          </p>
        </div>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="showLogoutModal = false">
            <span class="combat-text">STAY</span>
          </button>
          <button class="modal-btn confirm" @click="handleLogout">
            <span class="combat-text">EXIT</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";
import { useRouter } from "vue-router";

// Store and Router
const authStore = useAuthStore();
const router = useRouter();

// Reactive State
const showUserMenu = ref(false);
const showNotifications = ref(false);
const showLogoutModal = ref(false);
const unreadCount = ref(3);

// Computed Properties
const user = computed(() => authStore.user);
const isStaffOrAdmin = computed(() => {
  return user.value?.role === "staff" || user.value?.role === "admin";
});

// Mock Live Stats (in real app, these would come from API)
const liveStats = ref({
  activeFights: 2,
  ticketsSold: 247,
  todayIncrease: 18,
  capacity: 73,
  checkIns: 45,
});

// Mock Activities
const recentActivities = ref([
  {
    id: 1,
    type: "scan",
    description: "Ticket scanned for VIP Section A",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    status: "success",
  },
  {
    id: 2,
    type: "booking",
    description: "New booking: 4 tickets for Main Event",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    status: "success",
  },
  {
    id: 3,
    type: "checkin",
    description: "Fighter checked in: Ringside Section",
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    status: "success",
  },
  {
    id: 4,
    type: "alert",
    description: "Security alert: Gate 3 requires attention",
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    status: "warning",
  },
]);

// Methods
const getFighterRole = (role: string) => {
  const roles = {
    admin: "🏆 Arena Champion",
    staff: "🥊 Fighter Staff",
    user: "🎫 Arena Warrior",
  };
  return roles[role] || "🎫 Arena Warrior";
};

const getCapacityStatus = (capacity: number) => {
  if (capacity > 90) return "Full House";
  if (capacity > 75) return "High Demand";
  if (capacity > 50) return "Good Turnout";
  return "Available";
};

const getActivityIcon = (type: string) => {
  const icons = {
    scan: "mdi:qrcode-scan",
    booking: "mdi:ticket-confirmation",
    checkin: "mdi:check-circle",
    alert: "mdi:alert-circle",
    fight: "mdi:sword-cross",
  };
  return icons[type] || "mdi:information";
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - timestamp.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  return `${diffInHours}h ago`;
};

// Navigation Methods
const openQRScanner = () => {
  router.push("/mobile/scanner");
};

const navigateToBooking = () => {
  router.push("/mobile/book-tickets");
};

const navigateToDashboard = () => {
  router.push("/staff/dashboard");
};

const viewStats = () => {
  router.push("/mobile/stats");
};

const viewProfile = () => {
  showUserMenu.value = false;
  router.push("/mobile/profile");
};

const viewHistory = () => {
  showUserMenu.value = false;
  router.push("/mobile/history");
};

const viewSettings = () => {
  showUserMenu.value = false;
  router.push("/mobile/settings");
};

const confirmLogout = () => {
  showUserMenu.value = false;
  showLogoutModal.value = true;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push("/mobile/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Click outside handler
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".fighter-menu")) {
    showUserMenu.value = false;
  }
  if (!target.closest(".notification-btn")) {
    showNotifications.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener("click", handleClickOutside);

  // Check authentication
  if (!authStore.isAuthenticated) {
    router.push("/mobile/login");
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Page Meta
definePageMeta({
  layout: "mobile",
  middleware: "auth",
});

// Remove useSeoMeta import
// useSeoMeta({
//   title: 'Patong Arena - Combat Command Center',
//   description: 'Muay Thai arena staff dashboard and management system'
// })
</script>

<style scoped>
@import url("/assets/css/muay-thai-theme.css");

/* Arena Background */
.muay-thai-arena {
  min-height: 100vh;
  background: var(--bg-dark);
  position: relative;
  overflow-x: hidden;
}

.arena-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.ring-lights {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(255, 215, 0, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(225, 6, 0, 0.15) 0%,
      transparent 50%
    );
  animation: flickerLights 3s ease-in-out infinite alternate;
}

@keyframes flickerLights {
  0%,
  100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}

.fighter-silhouette {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(225, 6, 0, 0.05) 0%,
    rgba(0, 0, 0, 0.95) 50%,
    rgba(255, 215, 0, 0.05) 100%
  );
}

.arena-smoke {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at bottom,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 70%
  );
  animation: smokeMove 8s ease-in-out infinite;
}

@keyframes smokeMove {
  0%,
  100% {
    transform: translateY(0px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px);
    opacity: 0.5;
  }
}

/* Content Layout */
.arena-content {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  padding: 1.5rem 1rem;
  max-width: 480px;
  margin: 0 auto;
}

/* Arena Header */
.arena-header {
  margin-bottom: 2rem;
}

.fighter-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.fighter-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fighter-avatar {
  position: relative;
}

.avatar-icon {
  font-size: 3rem;
  color: var(--primary-red);
  filter: drop-shadow(0 0 10px rgba(225, 6, 0, 0.5));
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--bg-dark);
}

.status-indicator.online {
  background: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.fighter-details h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-light);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.fighter-role {
  font-size: 1rem;
  color: var(--primary-gold);
  margin: 0;
  font-weight: 500;
}

.arena-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.control-btn {
  background: rgba(225, 6, 0, 0.2);
  border: 1px solid var(--primary-red);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--primary-red);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.control-btn:hover {
  background: var(--primary-red);
  color: white;
  transform: scale(1.05);
}

.control-icon {
  font-size: 1.2rem;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--primary-red);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Fighter Menu */
.fighter-menu {
  position: relative;
}

.menu-trigger {
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid var(--primary-gold);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--primary-gold);
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-trigger:hover {
  background: var(--primary-gold);
  color: var(--bg-dark);
  transform: scale(1.05);
}

.menu-icon {
  font-size: 1.2rem;
}

.menu-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--primary-red);
  border-radius: 12px;
  padding: 1rem;
  min-width: 200px;
  backdrop-filter: blur(15px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.menu-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
}

.crown-icon {
  font-size: 1.2rem;
  color: var(--primary-gold);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.menu-item:hover {
  background: rgba(225, 6, 0, 0.2);
  color: var(--primary-red);
}

.menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.item-icon {
  font-size: 1rem;
}

.menu-divider {
  height: 1px;
  background: rgba(255, 215, 0, 0.3);
  margin: 0.5rem 0;
}

/* Arena Title Section */
.arena-title-section {
  text-align: center;
  margin-bottom: 2rem;
}

.arena-main-title {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--primary-red);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 10px rgba(225, 6, 0, 0.5), 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.arena-subtitle {
  font-size: 1.1rem;
  color: var(--primary-gold);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 1rem 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.title-decorations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.decoration-line {
  height: 2px;
  width: 60px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--primary-red),
    transparent
  );
}

.center-flame {
  font-size: 1.5rem;
  color: var(--primary-gold);
  animation: combatGlow 2s ease-in-out infinite alternate;
}

/* Section Styling */
.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--primary-gold);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.section-icon {
  font-size: 1.4rem;
  color: var(--primary-red);
}

/* Quick Actions */
.quick-actions-section {
  margin-bottom: 2rem;
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.action-card {
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card.primary-action {
  border-color: var(--primary-red);
  box-shadow: 0 0 20px rgba(225, 6, 0, 0.2);
}

.action-card.secondary-action {
  border-color: var(--primary-gold);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.action-card.tertiary-action {
  border-color: #3b82f6;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.action-card.stats-action {
  border-color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.2);
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 30px currentColor;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.action-icon {
  font-size: 2rem;
}

.action-icon.primary {
  color: var(--primary-red);
}
.action-icon.secondary {
  color: var(--primary-gold);
}
.action-icon.tertiary {
  color: #3b82f6;
}
.action-icon.stats {
  color: #10b981;
}

.action-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-light);
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.action-description {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.action-btn.primary {
  background: var(--primary-red);
  color: white;
}

.action-btn.secondary {
  background: var(--primary-gold);
  color: var(--bg-dark);
}

.action-btn.tertiary {
  background: #3b82f6;
  color: white;
}

.action-btn.stats {
  background: #10b981;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1rem;
}

/* Arena Status Section */
.arena-status-section {
  margin-bottom: 2rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.status-card {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  backdrop-filter: blur(5px);
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-icon {
  font-size: 1.2rem;
}

.status-icon.live {
  color: var(--primary-red);
}
.status-icon.gold {
  color: var(--primary-gold);
}
.status-icon.blue {
  color: #3b82f6;
}
.status-icon.green {
  color: #22c55e;
}

.status-label {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.status-value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--text-light);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.status-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.status-trend.up {
  color: #22c55e;
}
.status-trend.neutral {
  color: #64748b;
}

/* Activity Section */
.activity-section {
  margin-bottom: 2rem;
}

.activity-feed {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem;
  backdrop-filter: blur(5px);
}

.activity-icon-wrapper {
  background: rgba(225, 6, 0, 0.2);
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon {
  font-size: 1rem;
  color: var(--primary-red);
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 0.95rem;
  color: var(--text-light);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.activity-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.activity-status {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.activity-status.success {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.activity-status.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.combat-modal {
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid var(--primary-red);
  border-radius: 15px;
  padding: 2rem;
  max-width: 350px;
  width: 100%;
  backdrop-filter: blur(15px);
  box-shadow: 0 0 30px rgba(225, 6, 0, 0.3);
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-icon.danger {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 0.5rem;
}

.modal-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-light);
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.modal-content p {
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0 0 2rem 0;
  line-height: 1.6;
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.modal-btn.cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.modal-btn.confirm {
  background: #ef4444;
  color: white;
}

.modal-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

/* Combat Text Effect */
.combat-text {
  text-shadow: 0 0 5px currentColor, 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Responsive Design */
@media (min-width: 480px) {
  .arena-content {
    padding: 2rem 1.5rem;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .arena-content {
    max-width: 600px;
  }

  .status-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
